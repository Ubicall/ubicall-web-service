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
var mongoose = require('mongoose');
var ejs = require('ejs');
var session = require('express-session');
var passport = require('passport');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');
var clientController = require('./controllers/client');
var tokenController = require('./controllers/token');

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/beerlocker');

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
      app.use(passport.initialize());
    // apiApp.use(cors(ubicallCors.options));
    // apiApp.use(ubicallCors.cors);

    apiApp.post('/auth/token',tokenController.generateToken);

    apiApp.post('/sip/call', authController.isBearerAuthenticated,call.extract, call.createSipCall);

    apiApp.post('/web/call', authController.isBearerAuthenticated,call.extract, call.createWebCall);

    apiApp.delete('/call/:call_id', call.cancel);

    apiApp.post('/call/feedback/:call_id', authController.isBearerAuthenticated,call.submitFeedback);

    apiApp.post('/sip/account', sip.createSipAccount);

    apiApp.post('/web/account', sip.createWebAccount);

    apiApp.get('/ivr/:license_key', ivr.fetchIvr);

    apiApp.post('/ivr/:license_key/:version', ivr.createIvr);

    apiApp.put('/ivr/:license_key/:version', ivr.createIvr);

    /**
    * @param {String} key - license_key should be unique for each user.
    * @return {@link MissedParams} @param key doesn't exist
    * @return HTTP status - 200
    * @return HTTP status - 404 {@link NotFound} If can't return queue data
    * @example
    * {'message':'queue retrieved successfully','id':id_no ,'name':url}
    */
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
        return next(new NotFound(error , req.originalUrl));
      });
    });

    /**
    * @return HTTP status - 200
    * @return HTTP status - 500 {@link ServerError}
    * @example data={license_key:'licence_key_value','name':'name_value','url':'url_value'}
    */
    apiApp.get('/clients', function(req, res, next) {
      storage.getClients().then(function(clients) {
        return res.status(200).json({
          data: clients
        });
      }).otherwise(function(error) {
        log.error('error : ' + error);
        return next(new ServerError(error , req.path));
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
