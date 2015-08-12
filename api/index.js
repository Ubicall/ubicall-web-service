var when = require('when');
var express = require('express');
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
    apiApp.use(cors(ubicallCors.options));
    apiApp.use(ubicallCors.cors);

    apiApp.post('/call', function(req, res, next) {
      var call = {};
      call.sip = req.body.sip || req.body.voiceuser_id;
      call.license_key = req.body.license || req.body.license_key;
      call.call_data = req.body.form_data || req.body.json || req.body.call_data;
      call.longitude = req.body.longitude || req.body.long;
      call.longitude = req.body.latitude || req.body.lat;
      call.pstn = req.body.pstn || '0';
      call.address = req.body.address;
      call.time = req.body.time || req.body.call_time;
      call.queue = req.body.queue || req.body.queue_id || req.body.qid;

      if (!call.sip || !call.license_key || !call.queue) {
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



      storage.scheduleCall(call).then(function(call) {
        return res.status(200).json({
          message: 'call scheduled successfully',
          id: call.id
        });
      }).otherwise(function(error) {
        log.error('error : ' + error);
        return res.status(500).json({
          message: "unable to schedule call , try again later"
        });
      });

    });

    apiApp.delete('/call/:id' , function(req, res, next) {
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


    apiApp.get('/getsip/:sdk_name/:sdk_version/:deviceuid/:device_token/:device_name/:device_model/:device_version/:licence_key', function(req, res, next) {
  
   var sdk_name = req.params.sdk_name;
   var sdk_version = req.params.sdk_version;
   var deviceuid = req.params.deviceuid;
   var device_token = req.params.device_token;
   var device_name = req.params.device_name;
   var device_model = req.params.device_model;
   var device_version = req.params.device_version;
   var licence_key = req.params.licence_key;

      if(!sdk_name ||!sdk_version || !deviceuid ||!device_token || !device_name || !device_model || !device_version || !licence_key){
        return res.status(400).json({message : "missing parameters " , hint : "shoud send All Parameters"});
      }

      storage.cancelCall(sdk_name,sdk_version,deviceuid,device_token ,device_name,device_model,device_version,licence_key).then(function(call){
        return res.status(200).json({message : "call canceled successfully"});
      }).otherwise(function(error){
        log.error('error : ' + error);
        return res.status(500).json({message : "something is broken , try again later"});
      });

    });



    apiApp.get('/getqueue/:key', function(req, res, next) {
  
   var key = req.params.key;
   
      if(!key ){
        return res.status(400).json({message : "missing parameters " , hint : "shoud send key Parameter"});
      }

      storage.cancelCall(sdk_name).then(function(queue){

        return res.status(200).json({message : "successfully",'data:'+queue});
      }).otherwise(function(error){
        log.error('error : ' + error);
        return res.status(500).json({message : "something is broken , try again later"});
      });

    });


apiApp.post('/feedback', function(req, res, next) {
  

  var data = {};
  data.call_id = req.body.call_id 
  data.feedback = req.body.feedback 
  data.feedback_text = req.body.feedback_text 

  
   
      if(!data.call_id || !data.feedback  ){
        return res.status(400).json({message : "missing parameters " , hint : "shoud send call_id,feedback Parameters"});
      }

      storage.feedback(data).then(function(feedback){
        return res.status(200).json({message : "successfully"});
      }).otherwise(function(error){
        log.error('error : ' + error);
        return res.status(500).json({message : "something is broken , try again later"});
      });

    });






    return resolve(apiApp);
  });
}


module.exports = {
  init: init
}
