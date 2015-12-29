/**
 * ivr main functionality
 * @version 0.0.1
 * @module api/v1/ivr
 * @exports .
 * @namespace ivr
 */
var when = require("when");
var request = require("request");
var settings = require("../../settings");
var storage = require("../../storage");
var log = require("../../log");
var NotImplementedError = require("../errors").NotImplementedError;
var BadRequest = require("../errors").BadRequest;
var MissedParams = require("../errors").MissedParams;
var Forbidden = require("../errors").Forbidden;
var ServerError = require("../errors").ServerError;
var NotFound = require("../errors").NotFound;

/**
 * deploy plist on web by calling an api
 * @param version - plist version to deploy
 * @param authorization_header - Authorization used to proceed in this transaction
 * @return {@link NotFound} - if api return 404 error
 * @return HTTP status 200 - if plist deployed successfully on web
 * @private
 * @memberof ivr
 */
function __deployToWeb(version, authz) {
    return when.promise(function(resolve, reject) {
        var options = {
            url: settings.widgetHost + version,
            method: "POST",
            headers: {
                Authorization: authz
            }
        };
        log.verbose("working on deploying ivr to web " + options.url);
        request(options, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                log.verbose("error deploying " + options.url + " to web ");
                return reject(error || response.statusCode);
            } else {
                log.verbose(options.url + "deployed successfully to web ");
                return resolve(response.data);
            }
        });
    });
}

/**
 * get latest ivr
 * @param req.params - req params object
 * @throws {@link NotFound} - if storage.getVersion failed
 * @return HTTP status 200 - when your ivr fetched successfully
 * @example
 * // returns {version : version.version ,url : version.url }
 * GET /ivr
 * @memberof API
 */
function fetchIvr(req, res, next) {
    var license_key = req.user.licence_key;
    storage.getVersion(license_key).then(function(version) {
        log.verbose("ivr for " + license_key + " avialable at " + version.url);
        return res.status(200).json({
            version: version.version,
            url: version.url
        });
    }).otherwise(function(error) {
        return next(new Forbidden(error, req.path));
    });
}

/**
 * deploy ivr in both Mobile and Web clients
 * @param {Object} req.params - request param Object
 * @param {String} req.params.version - the version of plist file.
 * @param {Object} req.headers - request headers object
 * @throws {@link MissedParams} - if @param ivr.version is missing
 * @throws {@link ServerError} - if unable able to Update Web -  message *Unable to update Web,hence cannot update Mobile*
 * @throws {@link Forbidden} - if not able to fetch ivr with from storage
 * @throws {@link ServerError} - if web updated but unable to update mobile client , so we rollback web to previous version - message *Unable to update Mobile,hence rollback web*
 * @throws {@link ServerError} - if web updated but unable to update mobile client **and failed to rollback web version** - message *Unable to update Mobile or rollback web*
 * @return HTTP status 200 - if ivr deplyed successfully in both web and mobile clients
 * @example
 * // returns {message: "mobile & web clients updated successfully"}
 * POST /ivr/:version
 * PUT /ivr/:version
 * @memberof API
 */
function deployIVR(req, res, next) {
    var ivr = {};
    ivr.license_key = req.user.licence_key;
    ivr.version = req.params.version;

    var authz = req.user.authz;

    if (!ivr.license_key) {
        return next(new MissedParams(req.path, "license_key"));
    }

    if (!ivr.version) {
        return next(new MissedParams(req.path, "version"));
    }

    ivr.url = settings.plistHost + ivr.version;
    log.verbose("working on deploying ivr from " + ivr.url);
    __deployToWeb(ivr.version, authz).then(function() {
        storage.updateIVR(ivr).then(function(updated) {
            return res.status(200).json({
                message: "mobile & web clients updated successfully",
                version: updated.version,
                url: updated.url
            });
        }).otherwise(function(error) {
            storage.getIVR(ivr.license_key).then(function(ivr) { // get & deploy old ivr version
                __deployToWeb(ivr.version, authz).then(function() {
                    return next(new ServerError({}, req.path, "Unable to update Mobile,hence rollback web"));
                }).otherwise(function(error) {
                    return next(new ServerError({}, req.path, "Unable to update Mobile or rollback web"));
                });
            }).otherwise(function(error) {
                return next(new Forbidden(error, req.originalUrl));
            });
        });
    }).otherwise(function(error) {
        return next(new ServerError(error, req.path, "Unable to update Web,hence cannot update Mobile"));
    });
}


module.exports = {
    fetchIvr: fetchIvr,
    deployIVR: deployIVR
};