var express = require('express');
var when = require('when');
var bodyParser = require('body-parser');
var cors = require('cors');
var ubicallCors = require('../../ubicallCors');
var log = require('../../log');
var sip = require('./sip');
var call = require('./call');
var ivr = require('./ivr');
var errorHandler = require('../errorHandler');
var NotImplementedError = require('../errors').NotImplementedError;
var BadRequest = require('../errors').BadRequest;
var MissedParams = require('../errors').MissedParams;
var Forbidden = require('../errors').Forbidden;
var ServerError = require('../errors').ServerError;
var NotFound = require('../errors').NotFound;


var settings, storage;
var apiApp;

function init(_settings, _storage) {
  return when.promise(function(resolve, reject) {
    settings = _settings;
    storage = _storage;
    apiApp = express();

    apiApp.use(bodyParser.urlencoded({
      extended: true
    }));
    apiApp.use(bodyParser.json());
    // apiApp.use(cors(ubicallCors.options));
    // apiApp.use(ubicallCors.cors);

    apiApp.post('/sip/call', call.extract, call.createSipCall, errorHandler.handle);

    apiApp.post('/web/call', call.extract, call.createWebCall, errorHandler.handle);

    apiApp.delete('/call/:call_id', call.cancel, errorHandler.handle);

    apiApp.post('/call/feedback/:call_id', call.submitFeedback, errorHandler.handle);

    apiApp.post('/sip/account', sip.createSipAccount, errorHandler.handle);

    apiApp.post('/web/account', sip.createWebAccount, errorHandler.handle);

    apiApp.get('/ivr/:license_key', ivr.fetchIvr, errorHandler.handle);

    apiApp.post('/ivr/:license_key/:version', ivr.createIvr, errorHandler.handle);

    apiApp.put('/ivr/:license_key/:version', ivr.createIvr, errorHandler.handle);


    apiApp.get('/queue/:key', function(req, res, next) {
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
        return next(new NotFound(req.originalUrl));
      });
    }, errorHandler.handle);

    apiApp.get('/clients', function(req, res, next) {
      storage.getClients().then(function(clients) {
        return res.status(200).json({
          data: clients
        });
      }).otherwise(function(error) {
        log.error('error : ' + error);
        return next(new ServerError(req.path));
      });
    }, errorHandler.handle);

    return resolve(apiApp);
  });
}

module.exports = {
  init: init
}
