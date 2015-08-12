var express = require('express');
var path = require("path");
var http = require('http');
var router = express.Router();
var when = require('when');
var bodyParser = require('body-parser');
var validator = require('validator');
var cors = require('cors');
var ubicallCors = require('../ubicallCors');
var log = require('../log');
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
      //  apiApp.use(cors(ubicallCors.options));
      //apiApp.use(ubicallCors.cors);

      apiApp.post('/call', function(req, res, next) {
          var call = {};
          call.device_token = req.body.device_token;
          call.sip = req.body.sip || req.body.voiceuser_id;
          call.license_key = req.body.license || req.body.license_key;
          call.call_data = req.body.form_data || req.body.json || req.body.call_data;
          call.longitude = req.body.longitude || req.body.long;
          call.longitude = req.body.latitude || req.body.lat;
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
          if (pstn && pstn == 1) {
            storage.scheduleCall(call).then(function(call) {
              return res.status(200).json({
                  message: 'call retrieved successfully',
                  call: call.id
              });
            }).otherwise(function(error) {
              return res.status(500).json({
                message:'unable to get call,try again later'
              });
            });
          }
          //If mobile
          else if (pstn && pstn == 0) {
            storage.getDevice(call.device_token).then(function(device) {
              storage.getClient(call.license_key).then(function(client) {
                if (client.demo == 0) {
                  //insert in demo calls
                  storage.scheduleDemoCall(call,device.sip).then(function(dCall) {
                    // Call Web service
                    // http://10.209.96.174/generate/new_call/callfile/generate_file.php?extension='.$device.sip.'&time='.$time;
                    return res.status(200).json({
                        message: 'Demo call inserted successfully',
                        call: dCall.id
                    });
                  }).otherwise(function(error) {
                    return res.status(500).json({
                      message: "unable to insert demo call , try again later"
                    });
                  });
                }
                else {
                  storage.scheduleCall(call,device.sip).then(function(call) {
                    return res.status(200).json({
                        message: 'call retrieved successfully',
                        call: call.id
                    });
                  }).otherwise(function(error) {
                    return res.status(500).json({
                      message: "unable to get scheduled call , try again later"
                    });
                  });
                }

            }).otherwise(function(error) {
              return res.status(500).json({
                message: "unable to get scheduled call , try again later"
              });

          }).otherwise(function(error) {
            return res.status(500).json({
              message: "unable to get scheduled call , try again later"
            });
      });
    });
  }
});


        apiApp.get('/versionToken/:key', function(req, res) {
          var input_key = req.params.key; //change to params
          console.log('key is ' + input_key);
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

        return resolve(apiApp);
      });
  }


  module.exports = {
    init: init
  }
