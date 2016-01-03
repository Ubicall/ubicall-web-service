/**
 * sip main functionality
 * @version 0.0.1
 * @module api/v1/sip
 * @exports .
 * @namespace sip
 */
var sprintf = require("sprintf");
var randomstring = require("randomstring");
var settings = require("../../settings");
var storage = require("../../storage");
var log = require("../../log");
var NotImplementedError = require("../errors").NotImplementedError;
var BadRequest = require("../errors").BadRequest;
var MissedParams = require("../errors").MissedParams;
var Forbidden = require("../errors").Forbidden;
var ServerError = require("../errors").ServerError;

/**
 * create sip account for mobile client
 * @param {Object} req.body - request body Object
 * @param {String} req.body.sdk_name -the name of the sdk. Each client have a unique name
 * @param {String} req.body.sdk_version -version of the client’s sdk.
 * @param {String} req.body.device_model - the model of the device. (Ex: IPhone 5, iPhone 6, Samsung S3)
 * @param {String} req.body.device_version - device’s version . (Ex:IOS 7 , IOS 8, Kitkat, Lollipop)
 * @param {String} req.body.device_token -  your mobile device_token, not required if you use web client
 * @param {String} req.body.device_uid - each device has a unique user id @default **0000**
 * @param {String} req.body.device_name - name of your device @default **UNKNOWN**
 * @throws {@link MissedParams} if @param device.sdk_name is missing
 * @throws {@link MissedParams} if @param device.sdk_version is missing
 * @throws {@link MissedParams} if @param device.device_model is missing
 * @throws {@link MissedParams} if @param device.device_version is missing
 * @throws {@link MissedParams} if @param device.device_token is missing
 * @throws {@link Forbidden} storage.getClient failed
 * @throws {@link ServerError} if storage.createSipFriend failed
 * @throws {@link ServerError} if storage.incrementClientCount failed
 * @throws {@link ServerError} if storage.createSip failed
 * @return HTTP status 200 - if sip call submitted successfully
 * @example
 * // returns {username:"XXXX",password:"XXXXX",domain:"XXXX.XX.XX.X"}
 * POST /sip/account
 * @memberof API
 */
function createSipAccount(req, res, next) {
    var device = {};
    var missingParams = [];

    device.license_key = req.user.licence_key;
    device.sdk_name = req.body.sdk_name || missingParams.push("sdk_name");
    device.sdk_version = req.body.sdk_version || missingParams.push("sdk_version");
    device.token = req.body.device_token || missingParams.push("device_token");
    device.model = req.body.device_model || missingParams.push("device_model");
    device.version = req.body.device_version || missingParams.push("device_version");
    device.name = req.body.device_name || "UNKNOWN";
    device.uid = req.body.device_uid || "0000";

    if (missingParams.length > 0) {
        return next(new MissedParams(req.path, missingParams));
    }

    storage.getClient(device.license_key).then(function(client) {
        storage.getDevice(device.token).then(function(_device) {
            return res.status(200).json({
                username: _device.sip,
                password: _device.password,
                domain: _device.domain
            });
        }).otherwise(function(error) { // this is new device
            /*********************************************************************
             * SIP rule for mobile clients : CLIENT_ID + 000000000 + CLIENT_COUNT *
             **********************************************************************/
            var sip = client.id + sprintf("%'09s", 0) + (client.count + 1);

            var domain = settings.infra.clientServer.mobile_voice_server.external_ip;
            var password = randomstring.generate(16);

            storage.incrementClientCount(client.id).then(function(incremented) {
                storage.createSip(device, password, domain, sip).then(function(sipDevice) {
                    storage.createSipFriend(sip, password).then(function(friend) {
                        return res.status(200).json({
                            username: friend.name,
                            password: password,
                            domain: domain
                        });
                    }).otherwise(function(error) {
                        return next(new ServerError(error, req.path));
                    });
                }).otherwise(function(error) {
                    return next(new ServerError(error, req.path));
                });
            }).otherwise(function(error) {
                return next(new ServerError(error, req.path));
            });
        });
    }).otherwise(function(error) {
        return next(new Forbidden(error, req.path));
    });
}

/**
 * create sip account for web client
 * @param {Object} req.body - request body object
 * @param {String} req.body.sdk_name -the name of the sdk.
 * @param {String} req.body.sdk_version -version of the client’s sdk.
 * @param {String} req.body.uid - each device has a unique user id @default **0000**
 * @param {String} req.body.token -  your mobile device_token @default **0000**
 * @param {String} req.body.name - name of your device @default **WEB**
 * @param {String} req.body.model - the model of the device @default **WEB**
 * @param {String} req.body.version - device’s version @default **WEB**
 * @throws {@link MissedParams} if sdk_name was missed
 * @throws {@link MissedParams} if sdk_version was missed
 * @return {@link Forbidden} if no client found with this license_key
 * @return {@link ServerError} if storage.incrementClientCount failed
 * @return {@link ServerError} if storage.createSipDirectory failed
 * @return HTTP status 200 - if your call scheduled successfully
 * @example
 * // returns {username:"XXXX",password:"XXXXX",domain:"XXXX.XX.XX.X"}
 * POST /web/account
 * @memberof API
 */

function createWebAccount(req, res, next) {
    var device = {};
    var missingParams = [];

    device.license_key = req.user.licence_key;
    device.sdk_name = req.body.sdk_name || missingParams.push("sdk_name");
    device.sdk_version = req.body.sdk_version || missingParams.push("sdk_version");
    device.uid = req.body.device_uid || "0000";
    device.token = req.body.device_token || "0000";
    device.name = req.body.device_name || "WEB";
    device.model = req.body.device_model || "WEB";
    device.version = req.body.device_version || "WEB";

    if (missingParams.length > 0) {
        return next(new MissedParams(req.path, missingParams));
    }

    storage.getClient(device.license_key).then(function(client) {

        /********************************************************************************
         * SIP rule for web clients : 8890000 + CLIENT_ID + 7digits(end with client.count)*
         ********************************************************************************/
        var sip = "8890000" + client.id + sprintf("%'07s", (client.count + 1));

        var domain = settings.infra.clientServer.web_voice_server.external_ip;
        var password = randomstring.generate(16);

        storage.incrementClientCount(client.id).then(function(incremented) {
            storage.createSipDirectory(sip, password).then(function(directory) {
                return res.status(200).json({
                    "username": sip,
                    "password": password,
                    "domain": domain
                });
            }).otherwise(function(error) {
                return next(new ServerError(error, req.path));
            });
        }).otherwise(function(error) {
            return next(new ServerError(error, req.path));
        });
    }).otherwise(function(error) {
        return next(new Forbidden(error, req.path));
    });
}

module.exports = {
    createSipAccount: createSipAccount,
    createWebAccount: createWebAccount
};