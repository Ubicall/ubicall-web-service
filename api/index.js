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

    apiApp.get('/versionToken',function(req,res){
      var key =req.body.key;//change to params
      if(!key)
      {
        return res.status(400).json({message:'unable to get version',hint:'should submit a key'});

      }
      storage.getVersion(key).then(function(version){
        return res.status(200).json({
          message:'version retrieved successfully',
          version:version.version,
          url:version.url

      });
    }).otherwise(function(error){

      log.error('error : ' + error);
      return res.status(500).json({
        message:'unable to get version,try again later'
      });
    });

    });
apiApp.post('/getSchedCall',function(req,res,next){
  var call = {};
  call.device_token = req.body.device_token;
  call.license_key = req.body.license || req.body.license_key;
  call.json = req.body.json;
  call.longitude = req.body.long;
  call.latitude =  req.body.lat;
  call.address = req.body.address;
  call.time = req.body.time;
  call.qid = req.body.qid;
  var attribute_s = JSON.parse(json);
  var jsondb,attribute;
  for(var attribute in call.json)
  {
   attribute = {"key:"+attribute+",value:"+call.json[attribute] };
   jsondb = JSON.stringify(attribute);
  }
  storage.getSchedCall(key).then(function());

});

    apiApp.post('/accountInfo',function(req,res){
      var key = req.body.key;
      if(!key){
        return res.status(400).json({message:'Unable to get Account info',hint:'Should submit a key'});
      }

      storage.getAccountInfo(key).then(function(info){
        return res.status(200).json({message:'accont info retrieved successfully',
        information:info
      }).otherwise(function(error){
        log.error('error'+error);
        return res.status(500).json({
          message:'unable to get account info,Try again later'
        });

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

    return resolve(apiApp);
  });
}


module.exports = {
  init: init
}
