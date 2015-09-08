/**
* sip main functionality
* @version 0.0.1
* @module api/v1/sip
* @exports .
* @namespace sip
*/
var sprintf = require('sprintf');
var randomstring = require('randomstring');
var settings = require('../../settings');
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('./utils/errors').NotImplementedError;
var BadRequest = require('./utils/errors').BadRequest;
var MissedParams = require('./utils/errors').MissedParams;
var Forbidden = require('./utils/errors').Forbidden;
var ServerError =require('./utils/errors').ServerError;

var DIAL_STRING = settings.infra.clientServer.web.dialString;
/**
* create sip account for mobile client
* @param {Array} device - Array containing all attributes of a device
* @param {String} device.license_key - your api licence_key if not exist it will submit demo call , this fall back happen to be consisted with old ios app version and may be removed in next releases
* @param {String} device.sdk_name -the name of the sdk. Each client have a unique name
* @param {String} device.sdk_version -version of the client’s sdk.
* @param {String} device.name - name of your device
* @param {String} device.model - the model of the device. (Ex: IPhone 5, iPhone 6, Samsung S3)
* @param {String} device.uid - each device has a unique user id
* @param {String} device.version - device’s version . (Ex:IOS 7 , IOS 8, Kitkat, Lollipop)
* @param {String} device.token -  your mobile device_token, not required if you use web client
* @return HTTP status 200
* @return HTTP status 500 {@link ServerError} Unexpected Condition Was Encountered
* @return HTTP status 403  {@link Forbidden} Bad credentials
* @return {@link MissedParams} if @param device.token missed and your client is mobile.
* @example {username:'XXXX',password:'XXXXX',domain:'XXXX.XX.XX.X'}
* @memberof sip
*/
function createSipAccount(req, res, next) {
  var device = {};
  var missingParams = [];

  device.license_key = req.body.license_key || missingParams.push("license_key");
  device.sdk_name = req.body.sdk_name || missingParams.push("sdk_name");
  device.sdk_version = req.body.sdk_version || missingParams.push("sdk_version");
  device.uid = req.body.device_uid || '0000';
  device.token = req.body.device_token || missingParams.push("device_token");
  device.name = req.body.device_name || 'UNKNOWN';
  device.model = req.body.device_model || missingParams.push("device_model");
  device.version = req.body.device_version || missingParams.push("device_version");

  if (missingParams.length > 0) {
    return next(new MissedParams(req.path, missingParams));
  }

  storage.getDevice(device.token).then(function(_device) {
    return res.status(200).json({
      username: _device.sip,
      password: _device.password,
      domain: _device.domain
    });
  }).otherwise(function(error) {
    storage.getClient(device.license_key).then(function(client) {

      /*********************************************************************
      * SIP rule for mobile clients : CLIENT_ID + 000000000 + CLIENT_COUNT *
      **********************************************************************/
      var sip = client.id + sprintf("%'09s",0) + (client.count + 1);

      var domain = settings.infra.clientServer.mobile.public;
      var password = randomstring.generate(16);

      storage.incrementClientCount(client.id).then(function(incremented){
        storage.createSip(device, password, domain, sip).then(function(sipDevice){
          storage.createSipFriend(sip, password).then(function(friend){
            return res.status(200).json({
            username:friend.sip,
            password:friend.secret,
            domain : domain
            });
          }).otherwise(function(error){
            log.error("Error : " + error);
            return next(new ServerError(error , req.path));
          });
        }).otherwise(function(error){
          log.error("Error : " + error);
          return next(new ServerError(error , req.path));
        });
      }).otherwise(function(error){
        log.error("Error : " + error);
        return next(new ServerError(error , req.path));
      });
    }).otherwise(function(error) {
      log.error("Error : " + error);
      return next(new Forbidden(error,req.path));
    });
  });

}

/**
* create sip account for web client
* @param {Object} device - Array containing all attributes of a device
* @param {String} device.license_key - unique api licence_key
* @param {String} device.sdk_name -the name of the sdk.
* @param {String} device.sdk_version -version of the client’s sdk.
* @param {String} device.uid - each device has a unique user id @default **0000**
* @param {String} device.token -  your mobile device_token @default **0000**
* @param {String} device.name - name of your device @default **WEB**
* @param {String} device.model - the model of the device @default **WEB**
* @param {String} device.version - device’s version @default **WEB**
* @ignore **SIP rule for web clients** ``` 8890000 + CLIENT_ID + 7digits(end with client.count) ```
* @throws {@link MissedParams} if license_key was missed
* @throws {@link MissedParams} if sdk_name was missed
* @throws {@link MissedParams} if sdk_version was missed
* @return {@link Forbidden} if no client found with this license_key
* @return {@link ServerError} if storage.incrementClientCount failed
* @return {@link ServerError} if storage.createSipDirectory failed
* @return HTTP status 200 - if your call scheduled successfully
* @example
* // returns {username:'XXXX',password:'XXXXX',domain:'XXXX.XX.XX.X'}
* POST /web/account
* @memberof API
*/

function createWebAccount(req, res, next) {
  var device = {};
  var missingParams = [];

  device.license_key = req.body.license_key || missingParams.push("license_key");;
  device.sdk_name = req.body.sdk_name || missingParams.push("sdk_name");;
  device.sdk_version = req.body.sdk_version || missingParams.push("sdk_version");
  device.uid = req.body.device_uid || '0000';
  device.token = req.body.device_token || '0000';
  device.name = req.body.device_name || 'WEB';
  device.model = req.body.device_model || 'WEB';
  device.version = req.body.device_version || 'WEB';

  if (missingParams.length > 0) {
    return next(new MissedParams(req.path, missingParams));
  }

  storage.getClient(device.license_key).then(function(client) {

    /********************************************************************************
    * SIP rule for web clients : 8890000 + CLIENT_ID + 7digits(end with client.count)*
    ********************************************************************************/
    var sip = "8890000" + client.id + sprintf("%'07s",(client.count + 1));

    var domain = settings.infra.clientServer.web.public;
    var password = randomstring.generate(16);

    storage.incrementClientCount(client.id).then(function(incremented) {
      storage.createSipDirectory(sip , password , DIAL_STRING).then(function(directory){
        return res.status(200).json({
          'username': sip,
          'password': password,
          'domain': domain
        });
      }).otherwise(function(error){
        log.error("Error : " + error);
        return next(new ServerError(error , req.path));
      });
    }).otherwise(function(error) {
      log.error("Error : " + error);
      return next(new ServerError(error , req.path));
    });
  }).otherwise(function(error) {
    log.error("Error : " + error);
    return next(new Forbidden(error , req.path));
  });
}

module.exports = {
  createSipAccount: createSipAccount,
  createWebAccount: createWebAccount
}
