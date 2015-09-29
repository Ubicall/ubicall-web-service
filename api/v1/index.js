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
var ubicallOAuth = require('ubicall-oauth');
var passport = require('passport');

var settings, storage;
var apiApp;

function init(_settings, _storage) {
  return when.promise(function(resolve, reject) {
    settings = _settings;
    storage = _storage;
    apiApp = express();

    var upload = multer({ dest: settings.cdn.agent.avatarDestinationFolder })

    apiApp.use(bodyParser.urlencoded({
      extended: true
    }));
    apiApp.use(bodyParser.json());
    apiApp.use(passport.initialize());
    apiApp.use(passport.session());
    // apiApp.use(cors(ubicallCors.options));
    // apiApp.use(ubicallCors.cors);

    apiApp.post('/auth/token',ubicallOAuth.isClientAuthenticated,ubicallOAuth.isAuthenticated,ubicallOAuth.getToken);

    apiApp.post('/sip/call',ubicallOAuth.isBearerAuthenticated ,ubicallOAuth.needsPermission('write.sip.call'), midware.callExtract, call.createSipCall);

    apiApp.post('/web/call',ubicallOAuth.isBearerAuthenticated ,ubicallOAuth.needsPermission('write.web.call'), midware.callExtract, call.createWebCall);

    apiApp.delete('/call/:call_id',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('delete.call'), call.cancel);

    apiApp.get('/call/:call_id',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('read.call'),midware.isCallExist, call.getDetail);

    apiApp.get('/call/queue/:queue_id/:queue_slug',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('read.call') ,call.call);

    apiApp.put('/call/:call_id/done',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.call'),midware.isCallExist, call.done);

    apiApp.put('/call/:call_id/failed',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.call'),midware.isCallExist, call.failed);

    apiApp.post('/call/:call_id/feedback',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.feedback'),call.submitFeedback);

    apiApp.put('/call/:call_id/feedback',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.feedback'), call.submitFeedback);

    apiApp.post('/sip/account',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.sip.account'), sip.createSipAccount);

    apiApp.post('/web/account', ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.web.account'),sip.createWebAccount);

    apiApp.get('/ivr/:license_key', ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('read.ivr'),ivr.fetchIvr);

    apiApp.post('/ivr/:license_key/:version',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.ivr'), ivr.deployIVR);

    apiApp.put('/ivr/:license_key/:version',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.ivr'), ivr.deployIVR);

    apiApp.post('/agent',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.agent'),agent.update);

    apiApp.put('/agent',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.agent'),agent.update);

    apiApp.post('/agent/image',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.agent'), upload.single('image'),  agent.updateImage);

    apiApp.put('/agent/image',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('write.agent'),upload.single('image') ,  agent.updateImage);

    apiApp.get('/agent/calls',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('read.agent.calls'), agent.calls);

    apiApp.get('/agent/queues',ubicallOAuth.isBearerAuthenticated,ubicallOAuth.needsPermission('read.agent.calls') ,agent.queues);
    /**
    * @param {String} key - license_key should be unique for each user.
    * @return {@link MissedParams} @param key doesn't exist
    * @return HTTP status - 200
    * @return HTTP status - 404 {@link NotFound} If can't return queue data
    * @example
    * {'message':'queue retrieved successfully','id':id_no ,'name':url}
    */
    apiApp.get('/queue/:key', ubicallOAuth.isBearerAuthenticated,function(req, res, next) {
      var key = req.params.key;
      if (!key) {
        return next(new MissedParams(req.path, "key"));
      }
      storage.findQueue(key).then(function(queue) {
        return res.status(200).json({
          message: 'queue retrieved successfully',
          id: queue.id,
          name: queue.url
        });
      }).otherwise(function(error) {
        return next(new Forbidden(error , req.originalUrl));
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
