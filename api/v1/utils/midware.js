/**
* api shared middleware
* @version 0.0.1
* @module api/v1/utils/midware
* @exports .
* @namespace middleware
*/
var when = require('when');
var validator = require('validator');
var settings = require('../../../settings');
var NotImplementedError = require('./errors').NotImplementedError;
var BadRequest = require('./errors').BadRequest;
var MissedParams = require('./errors').MissedParams;
var Forbidden = require('./errors').Forbidden;
var ServerError = require('./errors').ServerError;
var NotFound = require('./errors').NotFound;
var log = require('../../../log');

/**
 * demo middle ware to simulate oauth and will be replaced by https://github.com/Ubicall/ubicall-web-service/tree/feature-oauth
 * @memberof middleware
 */
function isAuthenticated(req, res, next) {
  if(process.env.node_env == "test"){
    req.user = {
      id: 56,
      name: "Antoine FS",
      email: "aatef@rocketmail.com",
      number: "2222",
      image: "https://cdn.ubicall.com/agent/avatar/bcf3c1faaf30b15168db4da6575001ad.jpg",
      lic: "e6053eb8d35e02ae40beeeacef203c1a",
      api_key: "e6053eb8d35e02ae40beeeacef203c1a",
      sip: {
            num: "90000000000000021@104.239.164.247",
            cred: "xmolVGdwTRGsbDOJ"
            }
    };
    log.info("test user is used " + JSON.stringify(req.user));
    next();
  }else {
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
}

/**
 * middleware to check if your request has @param call_id
 * @param {Object} req.params - request params object
 * @param {Object} req.params.call_id - call_id request param
 * @throws {@link MissedParams} if @param req.params.call_id is undefined
 * @memberof middleware
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
 * @param {Object} req.body - request body object
 * @param {integer} req.body.pstn - flag to distinguish between mobile app [android - iphone] , web and regular phone call as {iphone : 0 , android : 1 , web : 2 , phone : 3}
 * @param {integer} req.body.sip - your phone number , virtual which generated from /sip/account or /web/account APIs or your real phone number if you will recieve un voip call
 * @param {uid} req.body.device_token - your mobile device_token, not required if you use web client
 * @param {uid} req.body.licence_key - your api licence_key if not exist it will submit demo call , this fall back happen to be consisted with old ios app version and may be removed in next releases
 * @param {json} req.body.call_data - json object contain your call meta info
 * @param {uid} req.body.longitude - your location longitude and it grabbed automatically
 * @param {uid} req.body.latitude - your location latitude and it grabbed automatically
 * @param {string} req.body.address - your location address and it grabbed automatically , but not provided if you use web client
 * @param {Date} req.body.time - time you like to call you , if not existed you will be called using FIFO algorithm (this may changed in next releases)
 * @param {integer} req.body.queue - what queue id you like to submit your call
 * @todo check if req.body.call_data is valid json if exist
 * @throws {@link MissedParams} if @param req.body.pstn is missing
 * @throws {@link MissedParams} if @param req.body.sip is missing
 * @throws {@link MissedParams} if @param req.body.device_token is missing and your client is mobile.
 * @throws {@link BadRequest} if @param req.body.json is not valid
 * @memberof middleware
 */
function callExtract(req, res, next) {

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

module.exports = {
  isAuthenticated : isAuthenticated,
  isCallExist : isCallExist,
  callExtract : callExtract
}
