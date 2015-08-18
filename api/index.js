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
var request = require('request');

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
      var options = {
        host: '10.209.96.174',
        path: '/generate/new_call/callfile/generate_file.php?extension=sip&time=call.time'
      }
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
      if (call.pstn && call.pstn == 1) {
        console.log('this is web');
        if (!call.sip) {
          return res.status(400).json({
            message: 'unable to schedule call',
            hint: 'what is your number?'
          });
        }
        storage.scheduleCall(call).then(function(call) {
          console.log('this is the call', call);
          return res.status(200).json({
            message: 'call retrieved successfully',
            call: call.id
          });
        }).otherwise(function(error) {
          console.log(error);
          return res.status(500).json({
            message: 'unable to get call,try again later'
          });
        });
      } else if (call.pstn && call.pstn == 0) { //If mobile

        storage.getDevice(call.device_token).then(function(device) {
          var _device = device;

          storage.getClient(call.license_key).then(function(client) {
            console.log(client);
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
                    console.log('request error', error);
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
              console.log('demo is 1');
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

    apiApp.post('/sip', function(req, res) {
      var call = {};
      var sdk = req.body.sdk_name;
      var sdk_v = req.body.sdk_version;
      var deviceuid = req.body.deviceuid;
      var device_token = req.body.device_token;
      var device_name = req.body.device_name;
      var device_version = req.body.device_version;
      var device_model = req.body.device_model;
      var license_key = req.body.license || req.body.license_key;
      if (!sdk || !sdk_version || !deviceuid || !device_token || !device_version || !device_model || !license_key) {
        return res.status(500).json({
          message: 'unable to retrieve sip',
          hint: 'Miising paramaters sdk,sdk_version,device user_id,device token,device version,device model,license key'
        });
      } else {

        storage.getDeviceSip(device_token).then(function(device) {
          return res.status(200).json({
            message: 'sip retrieved successfully',

          });
        }).otherwise(function(error) {
          return res.status(500).json({
            message: 'cannot get sip',

          });
        });


      }

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


    apiApp.get('/getsip', function(req, res, next) {
      data = {};
      data.sdk_name = req.body.sdk_name;
      data.sdk_version = req.body.sdk_version;
      data.deviceuid = req.body.deviceuid;
      data.device_token = req.body.device_token;
      data.device_name = req.body.device_name;
      data.device_model = req.body.device_model;
      data.device_version = req.body.device_version;
      data.licence_key = req.body.licence_key;

      if (!sdk_name || !sdk_version || !deviceuid || !device_token || !device_name || !device_model || !device_version || !licence_key) {
        return res.status(400).json({
          message: "missing parameters ",
          hint: "shoud send All Parameters"
        });
      }

      storage.getsip(data).then(function(data) {
        return res.status(200).json({
          message: "successfully",
          data: data
        });
      }).otherwi
      if (!key) {
        return res.status(400).json({
          message: "missing parameters ",
          hint: "shoud send key Parameter"
        });
      }

      storage.getQueue(sdk_name).then(function(queue) {
        if (queue != 'Invaled Key') {
          return res.status(200).json({
            data: queue
          });
        } else {
          return res.status(400).json({
            message: "Invaled Key"
          });
        }
      }).otherwise(function(error) {
        log.error('error : ' + error);
        return res.status(500).json({
          message: "something is broken , try again later"
        });
      });

    });


    apiApp.post('/feedback', function(req, res, next) {


      var data = {};
      data.call_id = req.body.call_id
      data.feedback = req.body.feedback
      data.feedback_text = req.body.feedback_text

      if (!data.call_id || !data.feedback) {
        return res.status(400).json({
          message: "missing parameters ",
          hint: "shoud send call_id,feedback Parameters"
        });
      }

      storage.feedback(data).then(function(feedback) {
        return res.status(200).json({
          message: "successfully"
        });
      }).otherwise(function(error) {
        log.error('error : ' + error);
        return res.status(500).json({
          message: "something is broken , try again later"
        });
      });

    });






    apiApp.post('/updateivr', function(req, res, next) {


      var data = {};
      data.url = req.body.url
      data.licence_key = req.body.licence_key
      data.server_id = req.body.server_id

      if (!data.url || !data.licence_key || !data.server_id) {
        return res.status(400).json({
          message: "missing parameters ",
          hint: "shoud send All Parameters"
        });
      }

      storage.updateIVR(data).then(function(IVR) {
        if (IVR != 'Invaled Key') {

          var options = {
            url: 'https://platform.ubicall.com/api/widget',
            method: 'POST',
            form: {
              'plistUrl': data.url,
            }
          }

          request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
              return res.status(200).json({
                message: "successfully"
              });
            } else {
              return res.status(500).json({
                message: "something is broken , try again later"
              });
            }
          });
        } else {
          return res.status(400).json({
            message: "Invaled Key"
          });
        }

      }).otherwise(function(error) {
        log.error('error : ' + error);
        return res.status(500).json({
          message: "something is broken , try again later"
        });
      });

    });



    apiApp.get('/get-clients', function(req, res, next) {


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


module.exports = {
  init: init
}
