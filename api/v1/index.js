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

    /**
     * @api {post} /auth/token Responsible for authentication by using Email or license_key
     * @apiParam {String} [user_email]  Email for agent's account
     * @apiParam {String} [user_password] Password for agent's account
     * @apiParam {String} [license_key]  Mandatory for Client
     * @apiParam {String} clientId  Mandatory for Client
     * @apiError  MissedParams Any of the required parameters is missing
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 422 Missing Params
     *     {
          "resource": "/auth/token",
          "message": "Validation Failed",
          "errors": [
            {
              "field": "license_key",
              "code": "missing_field"
            }
          ]
    *  }

     */
    apiApp.post('/auth/token',tokenController.authorize);//check on agent or licence_key as well as client secret & id then send token

    /**
    * @api {post} /sip/call Responsible fior scheduling a call
    * @apiParam {String} access_token Mandatory-Access token for api authorization
    * @apiParam {integer} pstn Mandatory Flag to distinguish between mobile app [android - iphone] , web and regular phone call as {iphone : 0 , android : 1 , web : 2 , phone : 3}
    * @apiParam {integer} sip  your phone number , virtual which generated from /sip/account or /web/account APIs or your real phone number if you will recieve un voip call
    * @apiParam {String} device_token - your mobile device_token, not required if you use web client
    * @apiParam {String} licence_key - your api licence_key if not exist it will submit demo call , this fall back happen to be consisted with old ios app version and may be removed in next releases
    * @apiParam {json} call_data - json object contain your call meta info
    * @apiParam {String} longitude - your location longitude and it grabbed automatically

    */
    apiApp.post('/sip/call', authController.isBearerAuthenticated,call.extract, call.createSipCall);

    apiApp.post('/web/call', authController.isBearerAuthenticated,call.extract, call.createWebCall);

    apiApp.delete('/call/:call_id',authController.isBearerAuthenticated,call.cancel);

    apiApp.post('/call/feedback/:call_id', authController.isBearerAuthenticated,call.submitFeedback);

    apiApp.post('/sip/account',sip.createSipAccount);

    apiApp.post('/web/account',sip.createWebAccount);

    apiApp.get('/ivr',authController.isBearerAuthenticated,ivr.fetchIvr);

    apiApp.post('/ivr/:license_key/:version',authController.isBearerAuthenticated,ivr.createIvr);

    apiApp.put('/ivr/:license_key/:version',authController.isBearerAuthenticated,ivr.createIvr);

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
      else{
      storage.findQueue(key).then(function(queue) {
        return res.status(200).json({
          message: 'queue retrieved successfully',
          id: queue.id,
          name: queue.url
        });
      }).otherwise(function(error) {
        return next(new NotFound(error , req.originalUrl));
      });
        }
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
