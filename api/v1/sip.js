var sprintf = require('sprintf');
var randomstring = require('randomstring');
var settings = require('../../settings');
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('../errors').NotImplementedError;
var BadRequest = require('../errors').BadRequest;
var MissedParams = require('../errors').MissedParams;
var Forbidden = require('../errors').Forbidden;

var DIAL_STRING = settings.infra.clientServer.web.dialString;

function createSip(req, res, next) {
  var data = {};
  var missingParams = [];

  data.license_key = req.body.license_key || missingParams.push("license_key");;
  data.sdk_name = req.body.sdk_name || missingParams.push("sdk_name");;
  data.sdk_version = req.body.sdk_version || missingParams.push("sdk_version");
  data.deviceuid = req.body.deviceuid || missingParams.push("deviceuid");
  data.device_token = req.body.device_token || missingParams.push("device_token");
  data.device_name = req.body.device_name || missingParams.push("device_name");
  data.device_model = req.body.device_model || missingParams.push("device_model");
  data.device_version = req.body.device_version || missingParams.push("device_version");

  if (missingParams.length > 0) {
    return next(new MissedParams(req.path, missingParams));
  }

  storage.getDevice(data.device_token).then(function(device) {
    return res.status(200).json({
      username: device.sip,
      password: device.password,
      domain: device.domain
    });
  }).otherwise(function(error) {
    storage.getClient(data.license_key).then(function(client) {
      var clientCount = client.count + 1;
      var sip = sprintf("[%'09s]", clientCount);
      sip = client.id + "000" + sip;
      var domain = settings.infra.clientServer.mobile.public;
      var password = randomstring.generate(16);

      storage.createSip(data, password, domain, sip);
      storage.incrementClientCount(client.id);
      storage.createSipFriend(sip, password);

      return res.status(200).json({
        username: sip,
        password: password,
        domain: domain
      });

    }).otherwise(function(error) {
      return next(new Forbidden(req.path));
    });
  });

}


function createWebSip(req, res, next) {
  var data = {};
  var missingParams = [];

  data.license_key = req.body.license_key || missingParams.push("license_key");;
  data.sdk_name = req.body.sdk_name || missingParams.push("sdk_name");;
  data.sdk_version = req.body.sdk_version || missingParams.push("sdk_version");
  data.deviceuid = req.body.deviceuid || missingParams.push("deviceuid");
  data.device_token = req.body.device_token || missingParams.push("device_token");
  data.device_name = req.body.device_name || missingParams.push("device_name");
  data.device_model = req.body.device_model || missingParams.push("device_model");
  data.device_version = req.body.device_version || missingParams.push("device_version");

  if (missingParams.length > 0) {
    return next(new MissedParams(req.path, missingParams));
  }

  storage.getClient(data.license_key).then(function(client) {
    var clientCount = client.count + 1;
    var sip = sprintf("[%'09s]", clientCount);
    sip = client.id + "000" + sip;
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
        return next(new ServerError(req.path));
      });
    }).otherwise(function(error) {
      return next(new ServerError(req.path));
    });
  }).otherwise(function(error) {
    return next(new Forbidden(req.path));
  });
}

module.exports = {
  createSip: createSip,
  createWebSip: createWebSip
}
