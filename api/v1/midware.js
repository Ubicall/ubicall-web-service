var when = require('when');
var validator = require('validator');
var settings = require('../../settings');
var NotImplementedError = require('../errors').NotImplementedError;
var BadRequest = require('../errors').BadRequest;
var MissedParams = require('../errors').MissedParams;
var Forbidden = require('../errors').Forbidden;
var ServerError = require('../errors').ServerError;
var NotFound = require('../errors').NotFound;

/**
 * demo middle ware to simulate oauth and will be replaced by https://github.com/Ubicall/ubicall-web-service/tree/feature-oauth
 */
function isAuthenticated(req, res, next) {
  if (!req.user) {
    return next(new Forbidden({
      message: "user not found"
    }, req.path));
  }
  if(req.headers['x-rtmp-session']){
      req.user.rtmp = req.headers['x-rtmp-session'];
  }
  next();
}

/**
 * middleware to check if your request has @param call_id
 * @return {@link MissedParams} if @param call_id is undefined
 */
function isCallExist(req, res, next) {
  var call_id = req.params.call_id;
  if (!call_id) {
    return next(new MissedParams(req.path, "call_id"));
  }
  req.ubi = req.ubi || {};
  req.ubi.call_id = req.params.call_id;
  next();
}

/**
 * extract call attributes from request body
 * @param {Array} call -An array that contains call atributes
 * @param {integer} pstn - flag to distinguish between mobile app [android - iphone] , web and regular phone call as {iphone : 0 , android : 1 , web : 2 , phone : 3}
 * @param {integer} sip - your phone number , virtual which generated from /sip/account or /web/account APIs or your real phone number if you will recieve un voip call
 * @param {uid} device_token - your mobile device_token, not required if you use web client
 * @param {uid} licence_key - your api licence_key if not exist it will submit demo call , this fall back happen to be consisted with old ios app version and may be removed in next releases
 * @param {json} call_data - json object contain your call meta info
 * @param {uid} longitude - your location longitude and it grabbed automatically
 * @param {uid} latitude - your location latitude and it grabbed automatically
 * @param {string} address - your location address and it grabbed automatically , but not provided if you use web client
 * @param {Date} time - time you like to call you , if not existed you will be called using FIFO algorithm (this may changed in next releases)
 * @param {integer} queue - what queue id you like to submit your call
 * @return {@link MissedParams} if @param pstn is missing
 * @return {@link MissedParams} if @param sip is missing
 * @return {@link MissedParams} if @param uid is missing and your client is mobile.
 * @return {@link BadRequest} if @param json is not valid
 */
function extract(req, res, next) {

  var call = {};
  var missingParams = [];

  call.pstn = req.body.pstn || missingParams.push("pstn");
  // if this is mobile call then device_token is critical parameter otherwise it not so important
  if (call.pstn == 0 || call.pstn == 1) {
    call.device_token = req.body.device_token || missingParams.push("device_token");
  } else {
    call.device_token = req.body.device_token;
  }
  call.sip = req.body.phone || req.body.sip || req.body.voiceuser_id || missingParams.push("phone");
  //TODO licence_key should be critical but why this changed ? search for #1 in current file
  call.license_key = req.body.license || req.body.licence || req.body.license_key;
  //TODO check if call.call_data is valid json if exist
  call.call_data = req.body.json || req.body.call_data || req.body.form_data;
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
