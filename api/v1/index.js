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

    var upload = multer({ dest: settings.cdn.agent.avatarDestinationFolder })

    apiApp.use(bodyParser.urlencoded({
      extended: true
    }));
    apiApp.use(bodyParser.json());
      app.use(passport.initialize());
    // apiApp.use(cors(ubicallCors.options));
    // apiApp.use(ubicallCors.cors);

    apiApp.post('/auth/token',tokenController.authorize);//check on agent or licence_key as well as client secret & id then send token

    apiApp.post('/sip/call', midware.callExtract, call.createSipCall);

    apiApp.post('/web/call', midware.callExtract, call.createWebCall);
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

    apiApp.delete('/call/:call_id',authController.isBearerAuthenticated,call.cancel);
    apiApp.get('/call/:call_id',midware.isAuthenticated , midware.isCallExist, call.getDetail);

    apiApp.get('/call/queue/:queue_id/:queue_slug',midware.isAuthenticated , call.call);

    apiApp.put('/call/:call_id/done',midware.isAuthenticated , midware.isCallExist, call.done);

    apiApp.put('/call/:call_id/failed',midware.isAuthenticated,midware.isCallExist, call.failed);

    apiApp.put('/call/:call_id/feedback', call.submitFeedback);

    apiApp.post('/call/feedback/:call_id', authController.isBearerAuthenticated,call.submitFeedback);

    apiApp.post('/sip/account',authController.isBearerAuthenticated,sip.createSipAccount);

    apiApp.post('/web/account',authController.isBearerAuthenticated,sip.createWebAccount);

    apiApp.get('/ivr',authController.isBearerAuthenticated,ivr.fetchIvr);

    apiApp.post('/ivr/:version', authController.isBearerAuthenticated,ivr.deployIVR);

    apiApp.put('/ivr/:version', authController.isBearerAuthenticated,ivr.deployIVR);

    apiApp.post('/agent',authController.isBearerAuthenticated,agent.update);

    apiApp.put('/agent',midware.isAuthenticated,agent.update);

    apiApp.post('/agent/image', midware.isAuthenticated , upload.single('image'),  agent.updateImage);

    apiApp.put('/agent/image',midware.isAuthenticated , upload.single('image') ,  agent.updateImage);

    apiApp.get('/agent/calls', midware.isAuthenticated, agent.calls);

    apiApp.get('/agent/queues', authController.isBearerAuthenticated,agent.queues);

    apiApp.get('/workingHours/:zone/:queue',authController.isBearerAuthenticated,call._workingHours);
    /**
    * @param {String} key - license_key should be unique for each user.
    * @return {@link MissedParams} @param key doesn't exist
    * @return HTTP status - 200
    * @return HTTP status - 404 {@link NotFound} If can't return queue data
    * @example
    * {'message':'queue retrieved successfully','id':id_no ,'name':url}
    */
    apiApp.get('/queue/',authController.isBearerAuthenticated, function(req, res, next) {
      var key = req.user.license_key;
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
        return next(new Forbidden(error , req.originalUrl));
      });
        }
    });


    /**
    * @return HTTP status - 200
    * @return HTTP status - 500 {@link ServerError}
    * @example data={license_key:'licence_key_value','name':'name_value','url':'url_value'}
    */
    apiApp.get('/clients',authController.isBearerAuthenticated,function(req, res, next) {
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
