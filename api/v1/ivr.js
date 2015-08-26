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

/**
* @param {String} key - license_key unique for each client,your api licence_key if not exist it will submit demo call , this fall back happen to be consisted with old ios app version and may be removed in next releases
* @return status 400 - unable to get versionToken
* @return status HTTP 200 - version retrieved successfully @example 'message':version retrieved successfully,data:{'version':'version value','url':'url value'}
* @return status 500 - {@link ServerError} unable to get version,try again later
*/
function fetchIvr(req, res , next) {
  var license_key = req.params.license_key;
  if (!license_key) {
    return next(new MissedParams(req.path, "license_key"));
  }
  storage.getVersion(license_key).then(function(version) {
    result ={'version':version.version,'url':version.url};
    return res.status(200).json({
      message: 'version retrieved successfully',
      data:result
    });
  }).otherwise(function(error) {
    log.error('error : ' + error);
    return next(new ServerError(req.path));
  });
}

/**
* @param {Array} ivr - Array containing IVR parameters
* @param {String} ivr.license_key - license_key unique for each user,your api licence_key if not exist it will submit demo call , this fall back happen to be consisted with old ios app version and may be removed in next releases @return {@link MissedParams} If no licence_key
* @param {String} ivr.version - the version of plist file.
* @return HTTP status 200 - message: mobile & web clients updated successfully
* @return HTTP status 500 {@link ServerError}Unable to update Mobile,hence rollback web
*/
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
          return next(new ServerError(req.path , "Unable to update Mobile,hence rollback web"));
        }).otherwise(function(error) {
          return next(new ServerError(req.path , "Unable to update Mobile or rollback web"));
        });
      }).otherwise(function(error) {
        log.error('error : ' + error);
        return next(new ServerError(req.path , "Unable to update Mobile or rollback web"));
      });
    });
  }).otherwise(function(error) {
    log.error('error : ' + error);
    return next(new ServerError(req.path , "Unable to update Web,hence cannot update Mobile"));
  });
}


module.exports = {
  fetchIvr: fetchIvr,
  createIvr: createIvr
}
