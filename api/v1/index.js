var express = require('express');
var path = require("path");
var http = require('http');
var router = express.Router();
var when = require('when');
var bodyParser = require('body-parser');
var validator = require('validator');
var request = require('request');
var sprintf = require('sprintf');
var randomstring = require('randomstring');
var cors = require('cors');
var ubicallCors = require('../../ubicallCors');
var log = require('../../log');
var sip = require('./sip');
var call = require('./call');
var errorHandler = require('../errorHandler');


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

    apiApp.get('/versionToken/:key', function(req, res) {
      var input_key = req.params.key; //change to params
      log.info('key is ' + input_key);
      if (!input_key) {
        return res.status(400).json({
          message: 'unable to get version',
          hint: 'should submit a key'
        });

      }
      storage.getVersion(input_key).then(function(version) {
        return res.status(200).json({
          message: 'version retrieved successfully',
          version: version.version,
          url: version.url

        });
      }).otherwise(function(error) {

        log.error('error : ' + error);
        return res.status(500).json({
          message: 'unable to get version,try again later'
        });
      });

    });

    apiApp.post('/sip/call', call.extract , call.createSipCall , errorHandler.handle);

    apiApp.post('/web/call', call.extract , call.createWebCall , errorHandler.handle);

    apiApp.delete('/call/:call_id', call.cancel , errorHandler.handle);

    apiApp.post('/call/feedback/:call_id', call.submitFeedback , errorHandler.handle);

    apiApp.post('/sip/account', sip.createSipAccount , errorHandler.handle);

    apiApp.post('/web/account', sip.createWebAccount , errorHandler.handle);


    apiApp.get('/queue/:key', function(req, res, next) {
      var key = req.params.key;
      if (!key) {
        return res.status(400).json({
          message: 'Invalid request',
          hint: 'should submit a key'
        });
      } else {
        storage.findQueue(key).then(function(queue) {
          return res.status(200).json({
            message: 'queue retrieved successfully',
            id: queue.id,
            name: queue.url
          });
        }).otherwise(function(error) {
          return res.status(404).json({
            message: 'cannot get queue data'
          });
        });
      }
    });

    apiApp.put('/ivr/:license_key/:version', function(req, res, next) {

      var data = {};
      data.license_key = req.params.license_key;
      data.version = req.params.version;

      //TODO check on plistHost concatenated with slash
      var plistHost = req.header("plistHost") || settings.plistHost;
      data.url = plistHost + data.license_key + '/' + data.server_id;
      if (!data.license_key) {
        return res.status(400).json({
          message: "missing license key ",
          hint: "shoud submit a license_key"
        });
      }

      __deployToWeb(settings.widgetHost, settings.plistHost, data.license_key, data.version).then(function() {
        storage.updateIVR(data).then(function(updated) {
          return res.status(200).json({
            message: "mobile & web clients updated successfully"
          });
        }).otherwise(function(error) {
          log.error('error : ' + error);
          storage.getIVR(data.license_key).then(function(ivr) { // get & deploy old ivr version
            __deployToWeb(settings.widgetHost, plistHost, ivr.licence_key, ivr.version).then(function() {
              return res.status(500).json({
                message: "Unable to update Mobile,hence rollback web"
              });
            }).otherwise(function(error) {
              return res.status(500).json({
                message: "Unable to update Mobile or rollback web"
              });
            });
          }).otherwise(function(error) {
            log.error('error : ' + error);
            return res.status(500).json({
              message: "Unable to update Mobile or rollback web"
            });
          });
        });
      }).otherwise(function(error) {
        return res.status(500).json({
          message: "Unable to update Web,hence cannot update Mobile "
        });
      });
    });


    apiApp.get('/clients', function(req, res, next) {
      storage.getClients().then(function(clients) {
        return res.status(200).json({
          data: clients
        });
      }).otherwise(function(error) {
        log.error('error : ' + error);
        return res.status(500).json({
          message: "something is broken , try again later"
        });
      });
    });

  return resolve(apiApp);
  });
}

function __deployToWeb(widgetHost, plistHost, license_key, version) {
  return when.promise(function(resolve, reject) {
    var options = {
      url: widgetHost + license_key + '/' + version,
      method: 'POST',
      headers: {
        plistHost: plistHost
      }
    };

    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        return resolve(response.data);
      } else {
        return reject(error);
      }
    });
  });
}


module.exports = {
  init: init
}
