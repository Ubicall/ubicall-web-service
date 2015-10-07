/**
 * API EndPoints
 * @version 0.0.1
 * @module api/v1/index
 * @exports .
 * @namespace API
 */
var express = require('express');
var when = require('when');
var bodyParser = require('body-parser');
var cors = require('cors');
var multer = require('multer');
var ubicallCors = require('../../ubicallCors');
var log = require('../../log');
var sip = require('./sip');
var call = require('./call');
var agent = require('./agent');
var ivr = require('./ivr');
var midware = require('./utils/midware');
var errorHandler = require('./utils/errorHandler');
var NotImplementedError = require('./utils/errors').NotImplementedError;
var BadRequest = require('./utils/errors').BadRequest;
var MissedParams = require('./utils/errors').MissedParams;
var Forbidden = require('./utils/errors').Forbidden;
var ServerError = require('./utils/errors').ServerError;
var NotFound = require('./utils/errors').NotFound;
var isBearerAuthenticated = require('ubicall-oauth').isBearerAuthenticated;
var needsPermission = require('ubicall-oauth').needsPermission;
var passport = require('passport');
var settings, storage;
var apiApp;

function init(_settings, _storage) {
  return when.promise(function(resolve, reject) {
    settings = _settings;
    storage = _storage;
    apiApp = express();

    var upload = multer({
      dest: settings.cdn.agent.avatarDestinationFolder
    })

    apiApp.use(passport.initialize());
    apiApp.use(passport.session());
    apiApp.use(bodyParser.urlencoded({
      extended: true
    }));
    apiApp.use(bodyParser.json());
    // apiApp.use(cors(ubicallCors.options));
    // apiApp.use(ubicallCors.cors);

    apiApp.use(midware.ensureCache)

    apiApp.post('/sip/call', isBearerAuthenticated, needsPermission('sip.call.write'), midware.callExtract, call.createSipCall);

    apiApp.post('/web/call', isBearerAuthenticated, needsPermission('web.call.write'), midware.callExtract, call.createWebCall);

    apiApp.delete('/call/:call_id', isBearerAuthenticated, needsPermission('call.delete'), call.cancel);

    apiApp.get('/call/:call_id', isBearerAuthenticated, needsPermission('call.read'), midware.isCallExist, call.getDetail);

    apiApp.get('/call/queue/:queue_id/:queue_slug', isBearerAuthenticated, needsPermission('call.make'), midware.ensureRTMP, call.call);

    apiApp.put('/call/:call_id/done', isBearerAuthenticated, needsPermission('call.write'), midware.isCallExist, call.done);

    apiApp.put('/call/:call_id/failed', isBearerAuthenticated, needsPermission('call.write'), midware.isCallExist, call.failed);

    apiApp.post('/call/:call_id/feedback', isBearerAuthenticated, needsPermission('feedback.write'), call.submitFeedback);

    apiApp.put('/call/:call_id/feedback', isBearerAuthenticated, needsPermission('feedback.write'), call.submitFeedback);

    apiApp.post('/sip/account', isBearerAuthenticated, needsPermission('sip.account.write'), sip.createSipAccount);

    apiApp.post('/web/account', isBearerAuthenticated, needsPermission('web.account.write'), sip.createWebAccount);

    apiApp.get('/ivr', isBearerAuthenticated, needsPermission('ivr.read'),req.ubicall.cache.ivr.get, ivr.fetchIvr);

    apiApp.post('/ivr/:version', isBearerAuthenticated, needsPermission('ivr.write'),req.ubicall.cache.ivr.invalidate, ivr.deployIVR);

    apiApp.put('/ivr/:version', isBearerAuthenticated, needsPermission('ivr.write'),req.ubicall.cache.ivr.invalidate, ivr.deployIVR);

    apiApp.post('/agent', isBearerAuthenticated, needsPermission('agent.write'),req.ubicall.cache.agent.invalidate, agent.update);

    apiApp.put('/agent', isBearerAuthenticated, needsPermission('agent.write'),req.ubicall.cache.agent.invalidate, agent.update);

    apiApp.post('/agent/image', isBearerAuthenticated, needsPermission('agent.write'), upload.single('image'),req.ubicall.cache.agent.invalidate, agent.updateImage);

    apiApp.put('/agent/image', isBearerAuthenticated, needsPermission('agent.write'), upload.single('image'),req.ubicall.cache.agent.invalidate, agent.updateImage);

    apiApp.get('/agent/calls', isBearerAuthenticated, needsPermission('agent.calls.read'), agent.calls);

    apiApp.get('/agent/queues', isBearerAuthenticated, needsPermission('agent.calls.read'), agent.queues);

    apiApp.get('/workinghours/:zone/:queue',isBearerAuthenticated,needsPermission('workinghours.read'), call._workingHours);
    /**
     * @param {String} key - license_key should be unique for each user.
     * @return {@link MissedParams} @param key doesn't exist
     * @return HTTP status - 200
     * @return HTTP status - 404 {@link NotFound} If can't return queue data
     * @example
     * {'message':'queue retrieved successfully','id':id_no ,'name':url}
     */
    apiApp.get('/queue', isBearerAuthenticated, function(req, res, next) {
      var key = req.user.license_key;
      storage.findQueue(key).then(function(queue) {
        return res.status(200).json({
          message: 'queue retrieved successfully',
          id: queue.id,
          name: queue.url
        });
      }).otherwise(function(error) {
        return next(new Forbidden(error, req.originalUrl));
      });
    });

    apiApp.use(errorHandler.log);
    apiApp.use(errorHandler.handle);


    return resolve(apiApp);
  });
}

module.exports = {
  init: init
}
