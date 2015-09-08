/**
* ivr main functionality
* @version 0.0.1
* @module api/v1/ivr
* @exports .
* @namespace ivr
*/
var when = require('when');
var request = require('request');
var settings = require('../../settings');
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('./utils/errors').NotImplementedError;
var BadRequest = require('./utils/errors').BadRequest;
var MissedParams = require('./utils/errors').MissedParams;
var Forbidden = require('./utils/errors').Forbidden;
var ServerError =require('./utils/errors').ServerError;
var NotFound =require('./utils/errors').NotFound;

/**
* deploy plist on web by calling an api
* @return {@link NotFound} - if api return 404 error
* @return HTTP status 200 - if plist deployed successfully on web
* @private
* @memberof ivr
*/
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
      } else if(error) {
        return reject(error);
      }else if(response.statusCodes = 404) {
        return reject(new NotFound( {} , options.url))
      }
    });
  });
}

/**
* @param {String} license_key - your api license_key which is unique for each client
* @throws {@link MissedParams} - if @param license_key is missing
* @throws {@link NotFound} - if storage.getVersion failed
* @return HTTP status 200 - when your license_key ivr fetched successfully
* @example
* // returns { message: "ivr with version "+ version.version +"retrieved successfully",version : version.version ,url : version.url }
* GET /ivr/:license_key
* @memberof API
*/
function fetchIvr(req, res , next) {
  var license_key = req.params.license_key;
  if (!license_key) {
    return next(new MissedParams(req.path, "license_key"));
  }
  storage.getVersion(license_key).then(function(version) {
    return res.status(200).json({
      message: "ivr with version "+ version.version +"retrieved successfully",
      version : version.version ,
      url : version.url
    });
  }).otherwise(function(error) {
    log.error('error : ' + error);
    return next(new NotFound(error , req.path));
  });
}

/**
* @param {Object} ivr - Object containing IVR attributes
* @param {String} ivr.license_key - license_key unique for each user,your api licence_key if not exist it will submit demo call , this fall back happen to be consisted with old ios app version and may be removed in next releases @return {@link MissedParams} If no licence_key
* @param {String} ivr.version - the version of plist file.
* @param {Url} plistHost - param can override default plistHost value
* @throws {@link MissedParams} - if @param ivr.license_key is missing
* @throws {@link MissedParams} - if @param ivr.version is missing
* @throws {@link ServerError} - if unable able to Update Web -  message *Unable to update Web,hence cannot update Mobile*
* @throws {@link ServerError} - if not able to fetch ivr with @param licence_key from storage - message *Unable to update Mobile or rollback web*
* @throws {@link ServerError} - if web updated but unable to update mobile client , so we rollback web to previous version - message *Unable to update Mobile,hence rollback web*
* @throws {@link ServerError} - if web updated but unable to update mobile client **and failed to rollback web version** - message *Unable to update Mobile or rollback web*
* @return HTTP status 200 - if ivr deplyed successfully in both web and mobile clients
* @example
* // returns {message: "mobile & web clients updated successfully"}
* POST /ivr/:license_key/:version
* PUT /ivr/:license_key/:version
* @memberof API
*/
function createIvr(req, res, next) {
  var ivr = {};
  ivr.license_key = req.params.license_key;
  ivr.version = req.params.version;

  if (!ivr.license_key) {
    return next(new MissedParams(req.path, "license_key"));
  }

  if (!ivr.version) {
    return next(new MissedParams(req.path, "version"));
  }

  //TODO check on plistHost concatenated with slash
  var plistHost = req.header("plistHost") || settings.plistHost;
  ivr.url = plistHost + ivr.license_key + '/' + ivr.version;

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
