var settings = require('../../settings');
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('../errors').NotImplementedError;
var BadRequest = require('../errors').BadRequest;
var MissedParams = require('../errors').MissedParams;
var Forbidden = require('../errors').Forbidden;
var ServerError =require('../errors').ServerError;

function create(req, res, next) {
  var call = {};
  var missingParams = [];

  call.device_token = req.body.device_token;
  call.sip = req.body.sip || req.body.voiceuser_id;
  call.license_key = req.body.license || req.body.license_key || missingParams.push("license_key");
  call.call_data = req.body.form_data || req.body.json || req.body.call_data;
  call.longitude = req.body.longitude || req.body.long;
  call.latitude = req.body.latitude || req.body.lat;
  call.pstn = req.body.pstn || '0'; // mobile or web
  call.address = req.body.address;
  call.time = req.body.time || req.body.call_time;
  call.queue = req.body.queue || req.body.queue_id || req.body.qid || missingParams.push("queue_id");

  if (missingParams.length > 0) {
    return next(new MissedParams(req.path, missingParams));
  }

  if (call.time && !validator.isAfter(call.time)) {
    return next(new BadRequest(req.path, "call_time"));
  }
  //If request from web
  if (call.pstn && call.pstn == 1) {
    log.info('this is web');
    if (!call.sip) {
      return next(new MissedParams(req.path, ["sip","voiceuser_id"]));
    }
    storage.scheduleCall(call).then(function(call) {
      log.info('this is the call', call);
      return res.status(200).json({
        message: 'call retrieved successfully',
        call: call.id
      });
    }).otherwise(function(error) {
      log.error('error : ' + error);
      return next(new ServerError(req.path));
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
            log.error('error : ' + error);
            return next(new ServerError(req.path));
          });
        } else {
          log.info('demo is 1');
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
  create: create,
  cancel: cancel,
  submitFeedback : submitFeedback
}
