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

    apiApp.post('/call', function(req, res, next) {

      var call = {};
      call.device_token = req.body.device_token;
      call.sip = req.body.sip || req.body.voiceuser_id;
      call.license_key = req.body.license || req.body.license_key;
      call.call_data = req.body.form_data || req.body.json || req.body.call_data;
      call.longitude = req.body.longitude || req.body.long;
      call.latitude = req.body.latitude || req.body.lat;
      call.pstn = req.body.pstn || '0'; // mobile or web
      call.address = req.body.address;
      call.time = req.body.time || req.body.call_time;
      call.queue = req.body.queue || req.body.queue_id || req.body.qid;

      if (!call.license_key || !call.queue) {
        return res.status(400).json({
          message: 'unable to schedule call',
          hint: 'should submit license key , phone and queue'
        });
      }

      if (call.time && !validator.isAfter(call.time)) {
        return res.status(400).json({
          message: 'unable to schedule call',
          hint: 'call time should be in the future'
        });
      }
      //If request from web
      if (call.pstn && call.pstn == 1) {
        log.info('this is web');
        if (!call.sip) {
          return res.status(400).json({
            message: 'unable to schedule call',
            hint: 'what is your number?'
          });
        }
        storage.scheduleCall(call).then(function(call) {
          log.info('this is the call', call);
          return res.status(200).json({
            message: 'call retrieved successfully',
            call: call.id
          });
        }).otherwise(function(error) {
          log.error(error);
          return res.status(500).json({
            message: 'unable to get call,try again later'
          });
        });
      } else if (call.pstn && call.pstn == 0) { //If mobile

        storage.getDevice(call.device_token).then(function(device) {
          var _device = device;

          storage.getClient(call.license_key).then(function(client) {
            log.info(client);
            if (client.demo == 0) {

              call.sip = device.sip;

              storage.scheduleDemoCall(call).then(function(dCall) { //insert in demo calls
                // Call Web service
                log.info('inside scheduleDemoCall', dCall)
                var options = {
                  //  104.239.166.30
                  host: '10.209.96.174',
                  path: '/generate/new_call/callfile/generate_file.php?extension="' + call.sip + '"&time="' + call.time + '"'
                }
                http.get(options, function(error, response, body) {
                  if (error) {
                    log.info('request error', error);
                  }
                });

                /* http://10.209.96.174/generate/new_call/callfile/generate_file.php?extension='.$device.sip.'&time='.$time;*/
                return res.status(200).json({
                  message: 'Demo call inserted successfully',
                  call: dCall.id
                });
              }).otherwise(function(error) {
                log.error(error);
                return res.status(500).json({
                  message: "unable to insert demo call , try again later"
                });
              });
            } else {
              log.info('demo is 1');
              storage.scheduleCall(call).then(function(call) {
                return res.status(200).json({
                  message: 'call retrieved successfully',
                  call: call.id
                });
              }).otherwise(function(error) {
                return res.status(500).json({
                  message: "unable to get scheduled call1 , try again later"
                });
              });
            }

          }).otherwise(function(error) {
            return res.status(500).json({
              message: "unable to get scheduled call2 , try again later"
            });

          });
        }).otherwise(function(error) {
          return res.status(500).json({
            message: "unable to get scheduled call , try again later"
          });
        });
      }
    });

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

    apiApp.delete('/call/:id', function(req, res, next) {
      var call_id = req.params.id;
      if (!call_id) {
        return res.status(400).json({
          message: "unable to cancle call ",
          hint: "shoud send call id to cancel call"
        });
      }

      storage.cancelCall(call_id).then(function(call) {
        return res.status(200).json({
          message: "call canceled successfully"
        });
      }).otherwise(function(error) {
        log.error('error : ' + error);
        return res.status(500).json({
          message: "something is broken , try again later"
        });
      });

    });

    apiApp.post('/sip', sip.createSip , errorHandler.handle);

    apiApp.post('/webacc', sip.createWebSip , errorHandler.handle);


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

    apiApp.post('/feedback/:call_id', function(req, res, next) {
      var data = {};
      data.call_id = req.params.call_id
      data.feedback = req.body.feedback
      data.feedback_text = req.body.feedback_text

      if (!data.call_id || !data.feedback) {
        return res.status(400).json({
          message: "missing parameters ",
          hint: "missing parameters : call_id ,feedback or both"
        });
      } else {
        storage.feedback(data).then(function(feedback) {
          return res.status(200).json({
            message: "feedback sent successfully"
          });
        }).otherwise(function(error) {
          log.error('error : ' + error);
          return res.status(500).json({
            message: "something is broken , try again later"
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
