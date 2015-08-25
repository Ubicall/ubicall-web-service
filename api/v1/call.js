var settings = require('../../settings');
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('../errors').NotImplementedError;
var BadRequest = require('../errors').BadRequest;
var MissedParams = require('../errors').MissedParams;
var Forbidden = require('../errors').Forbidden;
var ServerError = require('../errors').ServerError;


function __scheduleDemo(call) {
  return when.promise(function(resolve, reject) {
    return storage.scheduleDemoCall(call).then(function(dCall) {
      var options = {
        host: settings.infra.clientServer.mobile.public,
        path: '/generate/new_call/callfile/generate_file.php?extension="' + call.sip + '"&time="' + call.time + '"'
      }
      http.get(options, function(error, response, body) {
        if (!error && response.status == 200) {
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

function extract(req, res, next) {

  var call = {};
  var missingParams = [];

  // pstn - flag to distinguish between mobile app [android - iphone] , web and regular phone call
  // pstn {iphone : 0 , android : 1 , web : 2 , phone : 3}
  call.pstn = req.body.pstn || missingParams.push("pstn");
  call.device_token = req.body.device_token;
  call.sip = req.body.sip || req.body.voiceuser_id;
  //TODO licence_key should be critical n but why this moved search for #1 in curent file
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


function createSipCall(req, res, next) {

  var call = req.ubi.call;

  storage.getDevice(call.device_token).then(function(device) {
    var _device = device;

    //TODO #1 should be removed but else statment , why ? based in broken code on IOS
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
      storage.getClient(call.license_key).then(function(client) {
        if (client.demo == 0) {
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
      }).otherwise(function(error) {
        log.error('error : ' + error);
        return next(new ServerError(req.path));
      });
    }
  }).otherwise(function(error) {
    log.error('error : ' + error);
    return next(new ServerError(req.path));
  });
}


function createWebCall(req, res, next) {

  var call = req.ubi.call;

  //TODO #1 should be removed but else statment , why ? based in broken code on IOS
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
