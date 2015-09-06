var when = require('when');
var request = require('request');
var validator = require('validator');
var settings = require('../../settings');
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('../errors').NotImplementedError;
var BadRequest = require('../errors').BadRequest;
var MissedParams = require('../errors').MissedParams;
var Forbidden = require('../errors').Forbidden;
var ServerError = require('../errors').ServerError;
var NotFound = require('../errors').NotFound;

/**
* helper function used to sumbit demo call by calling storage.scheduleDemoCall
* and call external api to generate static call file and call you back
* @param {Array} call -call Array that contain call attributes
*/
function __scheduleDemo(call) {
  return when.promise(function(resolve, reject) {
    return storage.scheduleDemoCall(call).then(function(demoCall) {
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
          return resolve(demoCall);
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
* schedule demo call if client is undefined or client is exist but with demo flag equal zero
* schedule regular call if client exist and has demo flag equal one
* @return  HTTP status 500 {@link ServerError} if req.ubi.call.device_token not exist , __scheduleDemo failed or storage.scheduleCall failed
* @return HTTP 200 if your call submitted successfully
* @example {message: 'demo call scheduled successfully', call: XXXX }
* @example {message: 'call scheduled successfully', call: XXXX }
*/
function createSipCall(req, res, next) {

  var call = req.ubi.call;

  storage.getDevice(call.device_token).then(function(device) {
    storage.getClient(call.license_key).then(function(client) {
      if (client.demo == 0) { // schedule demo call if client demo flag is ZERO
        call.sip = device.sip;
        __scheduleDemo(call).then(function(dCall) {
          return res.status(200).json({
            message: 'demo call scheduled successfully',
            call: dCall.id
          });
        }).otherwise(function(error) {
          log.error('error : ' + error);
          return next(new ServerError(error , req.path));
        });
      } else { //schedule regualr call if client exist and has demo flag wity value other than zero
        storage.scheduleCall(call).then(function(call) {
          return res.status(200).json({
            message: 'call scheduled successfully',
            call: call.id
          });
        }).otherwise(function(error) {
          log.error('error : ' + error);
          return next(new ServerError(error , req.path));
        });
      }
    }).otherwise(function(error) { // schedule demo call if license_key is undefined or no client found with this license_key
      __scheduleDemo(call).then(function(dCall) {
        return res.status(200).json({
          message: 'demo call scheduled successfully',
          call: dCall.id
        });
      }).otherwise(function(error) {
        log.error('error : ' + error);
        return next(new ServerError(error , req.path));
      });
    }).otherwise(function(error) {
      log.error('error : ' + error);
      return next(new ServerError(error , req.path));
    });
  }).otherwise(function(error){
    log.error('error : ' + error);
    return next(new ServerError(error , req.path));
  });
}

/**
* schedule demo call if licence_key is undefined otherwise schedule regular call
* @return HTTP status 500 {@link ServerError} if__scheduleDemo failed or storage.scheduleCall failed
* @return HTTP status 200 if your call submitted successfully
* @example {message: 'call scheduled successfully', call: XXXX }
* @example {message: 'demo call scheduled successfully', call: XXXX }
*/
function createWebCall(req, res, next) {

  var call = req.ubi.call;

  //TODO #1 should be removed but else statment , why ? based on broken code on IOS
  if (!call.license_key) {
    __scheduleDemo(call).then(function(dCall) {
      return res.status(200).json({
        message: 'demo call scheduled successfully',
        call: dCall.id
      });
    }).otherwise(function(error) {
      log.error('error : ' + error);
      return next(new ServerError(error , req.path));
    });
  } else {
    storage.scheduleCall(call).then(function(call) {
      return res.status(200).json({
        message: 'call scheduled successfully',
        call: call.id
      });
    }).otherwise(function(error) {
      log.error('error : ' + error);
      return next(new ServerError(error , req.path));
    });
  }
}

/**
* get call with id @param call_id
* @param call_id - call_id to mark as done
* @return {@link NotFound} if no call found with @param call_id
* @return HTTP status 200 if call found and returned successfully
* @example {call: {id:'xx',agent:'xxx'}}
*/
function getDetail(req,res,next){
  var call_id = req.call_id;
  storage.getCall(call_id).then(function(call){
    return res.status(200).json({
      call: call
    });
  }).otherwise(function(error){
    log.error('error : ' + error);
    return next(new NotFound(error , req.path));
  })
}

/**
* process call from queue with id @param queue_id it will reset call if error occur in infrastructure servers
* @param queue_id - queue_id where we fetch the call
* @param queue_slug - slug of queue name
* @return {@link MissedParams} if @param queue_id not found
* @return {@link MissedParams} if @param queue_slug not found
* @return {@link MissedParams} if header @param x-rtmp-session not found
* @return HTTP status 200 if your call fetched successfully from queue
* @example {message: 'call updated successfully',call: {id:'xx',agent:'xxx'}}
*/
function call(req,res,next){
    var queue_id = req.params.queue_id;
    var queue_slug = req.params.queue_slug;
    if (!queue_id) {
      return next(new MissedParams(req.path, "queue_id"));
    }
    if (!queue_slug) {
      return next(new MissedParams(req.path, "queue_slug"));
    }
    if(!req.user.rtmp){
      return next(new MissedParams(req.path, "x-rtmp-session"));
    }
    storage.getCall(req.user,queue_id,queue_slug).then(function(call){
      res.status(200).json(call);
      infra.call(call,req.user).otherwise(function(error){
        log.error('error : ' + error);
        storage.markCallFail(call,req.user,error,{reset : true}).otherwise(function(error){
          log.error('error : ' + error);
        });
      });
    }).otherwise(function(error){
      log.error('error : ' + error);
      return next(new NotFound(error , req.path));
    });
}

/**
* mark call with id @param call_id as done
* @param call_id - call_id to mark as done
* @param duration - how long this call take place
* @return {@link NotFound} if no call found with @param call_id
* @return {@link Forbidden} if call with @param call_id has is_agent other than req.user.id
* @return {@link ServerError} if storage.markCallFail failed
* @return HTTP status 200 if your call state updated successfully
* @example {message: 'call updated successfully',call: {id:'xx',agent:'xxx'}}
*/
function done(req,res,next){
  var details = {};
  details.duration = req.body.duration || 0;
  var call_id = req.call_id;
  storage.getCall(call_id).then(function(call){
    if(call.id_agent != req.user.id){
        return next(new Forbidden({message : "call not found to user " + req.user.name},req.path));
    }
    call.duration = details.duration;
    storage.markCallDone(call).then(function(call){
      return res.status(200).json({
        message: 'call updated successfully',
        call: call
      });
    }).otherwise(function(error){
      log.error('error : ' + error);
      return next(new ServerError(error , req.path));
    })
  }).otherwise(function(error){
    log.error('error : ' + error);
    return next(new NotFound(error , req.path));
  });
}

/**
* mark call with id @param call_id as failed , which it will be retried if failed times is less than fail's limit
* @param call_id - call_id to mark as failed
* @param error - why this call failed
* @return {@link NotFound} if no call found with @param call_id
* @return {@link Forbidden} if call with @param call_id has is_agent other than req.user.id
* @return {@link ServerError} if storage.markCallFail failed
* @return HTTP status 200 if your call state updated successfully
* @example {message: 'call updated successfully',call: {id:'xx',agent:'xxx'}}
*/
function failed(req,res,next){
  var details = {};
  details.error = req.body.error || 'unable to contact client';
  var call_id = req.call_id;
  storage.getCall(call_id).then(function(call){
    if(call.id_agent != req.user.id){
        return next(new Forbidden({message : "call not found to user " + req.user.name},req.path));
    }
    call.failure_cause = call.failure_cause_txt = details.error;
    storage.markCallFail(call).then(function(call){
      return res.status(200).json({
        message: 'call updated successfully',
        call: call
      });
    }).otherwise(function(error){
      log.error('error : ' + error);
      return next(new ServerError(error , req.path));
    })
  }).otherwise(function(error){
    log.error('error : ' + error);
    return next(new NotFound(error , req.path));
  });
}

/**
* cancel call with id @param call_id
* @param {integer} call_id - call_id to cancel
* @return HTTP status 422 - {@link MissedParams} if @param call_id is undefined
* @return HTTP status 500 {@link ServerError} if storage.cancelCall failed
* @return HTTP 200 if your call canceled successfully
*@example {message: 'call canceled successfully'}
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
    return next(new ServerError(error , req.path));
  });

}
/**
* submit feedback for call with id @param call_id
* @param {Integer} call_id - call_id to submit feedback on
* @return MissedParams if @param call_id is undefined or (@param feedback and @param feedback_text)
* @return HTTP status 500 {@link ServerError} if storage.feedback failed
* @return HTTP status - 200 message: "feedback sent successfully"
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
    return next(new ServerError(error , req.path));
  });

}

module.exports = {
  extract: extract,
  createSipCall: createSipCall,
  createWebCall: createWebCall,
  getDetail:getDetail,
  call:call,
  cancel: cancel,
  done:done,
  failed:failed,
  submitFeedback: submitFeedback
}
