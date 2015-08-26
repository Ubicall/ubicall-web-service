var settings = require('../../settings');
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('../errors').NotImplementedError;
var BadRequest = require('../errors').BadRequest;
var MissedParams = require('../errors').MissedParams;
var Forbidden = require('../errors').Forbidden;
var ServerError =require('../errors').ServerError;

function __deployToWeb(widgetHost, plistHost, license_key, version) {
  return when.promise(function(resolve, reject) {
    var options = {
      url: widgetHost + license_key + '/' + version,
      method: 'POST',
      headers: {
        plistHost: plistHost
      }
    };

    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        return resolve(response.data);
      } else {
        return reject(error);
      }
    });
  });
}

function fetchIvr(req, res , next) {
  var license_key = req.params.license_key;
  if (!license_key) {
    return next(new MissedParams(req.path, "license_key"));
  }
  storage.getVersion(license_key).then(function(version) {
    return res.status(200).json({
      message: 'version retrieved successfully',
      version: version.version,
      url: version.url
    });
  }).otherwise(function(error) {
    log.error('error : ' + error);
    return next(new ServerError(error , req.path));
  });
}

function createIvr(req, res, next) {
  var ivr = {};
  ivr.license_key = req.params.license_key;
  ivr.version = req.params.version;

  //TODO check on plistHost concatenated with slash
  var plistHost = req.header("plistHost") || settings.plistHost;
  ivr.url = plistHost + ivr.license_key + '/' + ivr.version;
  if (!ivr.license_key) {
    return next(new MissedParams(req.path, "license_key"));
  }

  __deployToWeb(settings.widgetHost, settings.plistHost, ivr.license_key, ivr.version).then(function() {
    storage.updateIVR(ivr).then(function(updated) {
      return res.status(200).json({
        message: "mobile & web clients updated successfully"
      });
    }).otherwise(function(error) {
      log.error('error : ' + error);
      storage.getIVR(ivr.license_key).then(function(ivr) { // get & deploy old ivr version
        __deployToWeb(settings.widgetHost, plistHost, ivr.licence_key, ivr.version).then(function() {
          return next(new ServerError( {} , req.path , "Unable to update Mobile,hence rollback web"));
        }).otherwise(function(error) {
          return next(new ServerError({} , req.path , "Unable to update Mobile or rollback web"));
        });
      }).otherwise(function(error) {
        log.error('error : ' + error);
        return next(new ServerError(error ,req.path , "Unable to update Mobile or rollback web"));
      });
    });
  }).otherwise(function(error) {
    log.error('error : ' + error);
    return next(new ServerError(error, req.path , "Unable to update Web,hence cannot update Mobile"));
  });
}


module.exports = {
  fetchIvr: fetchIvr,
  createIvr: createIvr
}
