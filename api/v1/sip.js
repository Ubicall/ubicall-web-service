var sprintf = require('sprintf');
var randomstring = require('randomstring');
var settings = require('../../settings');
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('../errors').NotImplementedError;
var BadRequest = require('../errors').BadRequest;
var MissedParams = require('../errors').MissedParams;
var Forbidden = require('../errors').Forbidden;
var ServerError =require('../errors').ServerError;

var DIAL_STRING = settings.infra.clientServer.web.dialString;

function createSipAccount(req, res, next) {
  var device = {};
  var missingParams = [];

  device.license_key = req.body.license_key || missingParams.push("license_key");;
  device.sdk_name = req.body.sdk_name || missingParams.push("sdk_name");;
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
              username: friend.name,
              password: friend.secret,
              domain: domain
            });
          }).otherwise(function(error){
            log.error("Error : " + error);
            return next(new ServerError(req.path));
          });
        }).otherwise(function(error){
          log.error("Error : " + error);
          return next(new ServerError(req.path));
        });
      }).otherwise(function(error){
        log.error("Error : " + error);
        return next(new ServerError(req.path));
      });
    }).otherwise(function(error) {
      log.error("Error : " + error);
      return next(new Forbidden(req.path));
    });
  });

}


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
          username: sip,
          password: password,
          domain: domain
        });
      }).otherwise(function(error){
        log.error("Error : " + error);
        return next(new ServerError(req.path));
      });
    }).otherwise(function(error) {
      log.error("Error : " + error);
      return next(new ServerError(req.path));
    });
  }).otherwise(function(error) {
    log.error("Error : " + error);
    return next(new Forbidden(req.path));
  });
}

module.exports = {
  createSipAccount: createSipAccount,
  createWebAccount: createWebAccount
}
