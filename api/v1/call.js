var settings = require('../../settings');
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('../errors').NotImplementedError;
var BadRequest = require('../errors').BadRequest;
var MissedParams = require('../errors').MissedParams;
var Forbidden = require('../errors').Forbidden;
var ServerError = require('../errors').ServerError;

/**
* helper function used to sumbit demo call by calling storage.scheduleDemoCall
* and call external api to generate static call file and call you back
*/
function __scheduleDemo(call) {
  return when.promise(function(resolve, reject) {
    return storage.scheduleDemoCall(call).then(function(dCall) {
      var options = {
        url: 'http://' + settings.infra.clientServer.mobile.public + '/generate/new_call/callfile/generate_file.php',
        method: 'GET',
        qs: {
          extension: call.sip,
          time: call.time
        }
      };
      request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          return resolve();
        } else {
          return reject(error);
        }
      });
    }).otherwise(function(error) {
      return reject(error);
    });
  });
}

/**
* extract call attributes from request body
* @param {integer} pstn - flag to distinguish between mobile app [android - iphone] , web and regular phone call as {iphone : 0 , android : 1 , web : 2 , phone : 3}
* @param {integer} sip - your phone number , virtual which generated from /sip/account or /web/account APIs or your real phone number if you will recieve un voip call
* @param {uid} device_token - your mobile device_token ,critiacl if your client is mobile and not required if you use web client
* @param {uid} licence_key - your api licence_key if not exist it will submit demo call , this fall back happen to be consisted with old ios app version and may be removed in next releases
* @param {json} call_data - json object contain your call meta info
* @param {uid} longitude - your location longitude and it grabbed automatically
* @param {uid} latitude - your location latitude and it grabbed automatically
* @param {string} address - your location address and it grabbed automatically , but not provided if you use web client
* @param {Date} time - time you like to call you , if not existed you will be called using FIFO algorithm (this may changed in next releases)
* @param {integer} queue - what queue id you like to submit your call
*/
function extract(req, res, next) {

  var call = {};
  var missingParams = [];

  call.pstn = req.body.pstn || missingParams.push("pstn");
  // if this is mobile call then device_token is critical parameter otherwise it not so important
  if(call.pstn == 0 || call.pstn == 1){
      call.device_token = req.body.device_token || missingParams.push("device_token");
  }else {
    call.device_token = req.body.device_token;
  }
  call.sip = req.body.sip || req.body.voiceuser_id || req.body.phone  || missingParams.push("phone");
  //TODO licence_key should be critical but why this changed ? search for #1 in current file
  call.license_key = req.body.license || req.body.license_key;
  call.call_data = req.body.form_data || req.body.json || req.body.call_data;
  call.longitude = req.body.longitude || req.body.long;
  call.latitude = req.body.latitude || req.body.lat;
  call.address = req.body.address;
  call.time = req.body.time || req.body.call_time;
  call.queue = req.body.queue || req.body.queue_id || req.body.qid || missingParams.push("queue_id");

  if (missingParams.length > 0) {
    return next(new MissedParams(req.path, missingParams));
  }

  if (call.time && !validator.isAfter(call.time)) {
    return next(new BadRequest(req.path, "call_time"));
  }
  req.ubi = {};
  req.ubi.call = call;
  next();
}

/**
* schedule demo call if client is undefined or client is exist but with demo flag equal zero
* schedule regular call if client exist and has demo flag equal one
* @return ServerError if device_token not exist , __scheduleDemo failed or storage.scheduleCall failed
* @return HTTP 200 if your call submitted successfully
*/
function createSipCall(req, res, next) {

  var call = req.ubi.call;

  storage.getDevice(call.device_token).then(function(device) {
    var _device = device;
    storage.getClient(call.license_key).then(function(client) {
      if (client.demo == 0) { // schedule demo call if client demo flag is ZERO
        call.sip = device.sip;
        __scheduleDemo(call).then(function() {
          return res.status(200).json({
            message: 'Demo call inserted successfully',
            call: dCall.id
          });
        }).otherwise(function(error) {
          log.error('error : ' + error);
          return next(new ServerError(req.path));
        });
      } else { //schedule regualr call if client exist and has demo flag wity value other than zero
        storage.scheduleCall(call).then(function(call) {
          return res.status(200).json({
            message: 'call retrieved successfully',
            call: call.id
          });
        }).otherwise(function(error) {
          log.error('error : ' + error);
          return next(new ServerError(req.path));
        });
      }
    }).otherwise(function(error) { // schedule demo call if license_key is undefined or no client found with this license_key
      __scheduleDemo(call).then(function() {
        return res.status(200).json({
          message: 'Demo call inserted successfully',
          call: dCall.id
        }).otherwise(function(error) {
          log.error('error : ' + error);
          return next(new ServerError(req.path));
        });
      });
    }).otherwise(function(error) {
      log.error('error : ' + error);
      return next(new ServerError(req.path));
    });
  }).otherwise(function(error){
    log.error('error : ' + error);
    return next(new ServerError(req.path));
  });
}

/**
* schedule demo call if licence_key is undefined otherwise schedule regular call
* @return ServerError if__scheduleDemo failed or storage.scheduleCall failed
* @return HTTP 200 if your call submitted successfully
*/
function createWebCall(req, res, next) {

  var call = req.ubi.call;

  //TODO #1 should be removed but else statment , why ? based on broken code on IOS
  if (!call.license_key) {
    __scheduleDemo(call).then(function() {
      return res.status(200).json({
        message: 'Demo call inserted successfully',
        call: dCall.id
      });
    }).otherwise(function(error) {
      log.error('error : ' + error);
      return next(new ServerError(req.path));
    });
  } else {
    storage.scheduleCall(call).then(function(call) {
      return res.status(200).json({
        message: 'call retrieved successfully',
        call: call.id
      });
    }).otherwise(function(error) {
      log.error('error : ' + error);
      return next(new ServerError(req.path));
    });
  }
}

/**
* cancel call with id @param call_id
* @param {integer} call_id - call_id to cancel
* @return MissedParams if @param call_id is undefined
* @return ServerError if storage.cancelCall failed
* @return HTTP 200 if your call canceled successfully
*/
function cancel(req, res, next) {
  var call_id = req.params.call_id;
  if (!call_id) {
    return next(new MissedParams(req.path, "call_id"));
  }
  storage.cancelCall(call_id).then(function(call) {
    return res.status(200).json({
      message: "call canceled successfully"
    });
  }).otherwise(function(error) {
    log.error('error : ' + error);
    return next(new ServerError(req.path));
  });

}

/**
* submit feedback for call with id @param call_id
* @param {integer} call_id - call_id to submit feedback on
* @return MissedParams if @param call_id is undefined or (@param feedback and @param feedback_text)
* @return ServerError if storage.feedback failed
* @return HTTP 200 if your call's feedback submitted successfully
*/
function submitFeedback(req, res, next) {
  var feedback = {};
  var missingParams = [];

  feedback.call_id = req.params.call_id || missingParams.push("call_id");
  feedback.feedback = feedback.feedback_text = req.body.feedback || req.body.feedback_text || missingParams.push("feedback");

  if (missingParams.length > 0) {
    return next(new MissedParams(req.path, missingParams));
  }

  storage.feedback(feedback).then(function(feedback) {
    return res.status(200).json({
      message: "feedback sent successfully"
    });
  }).otherwise(function(error) {
    log.error('error : ' + error);
    return next(new ServerError(req.path));
  });

}

module.exports = {
  extract: extract,
  createSipCall: createSipCall,
  createWebCall: createWebCall,
  cancel: cancel,
  submitFeedback: submitFeedback
}
