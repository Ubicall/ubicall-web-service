/**
 * email main functionality
 * @version 0.0.1
 * @module api/v1/email
 * @exports .
 * @namespace email
 */
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('./utils/errors').NotImplementedError;
var BadRequest = require('./utils/errors').BadRequest;
var MissedParams = require('./utils/errors').MissedParams;
var Forbidden = require('./utils/errors').Forbidden;
var ServerError = require('./utils/errors').ServerError;
var NotFound = require('./utils/errors').NotFound;

/**
* get Email using user licence_key
* @param {Array} email -email input data
* @param {String} req.user.licence_key - your api licence_key
* @throws {@link NotFound} if no email found
* @return HTTP 200 if your email retrieved successfully
* @example
* // returns { "emails": [
* //   {
* //      "id": XX,"client_id": XXXXX,"licence_key": "XXXXXXXXXX","name": "XXX XXXX",
* //     "destination": "support@sandcti.com","subject": "Sales request","message": null
* //    },
* //   {
* //      "id": XXX,"client_id": XXXXXX,"licence_key": "XXXXXXXXXX","name": "XXX XXXX",
* //      "destination": "support@sandcti.com","subject": "Support request","message": null
* //   },
* //  ]
* //}
* GET  /email
* @memberof API
*/
function getEmail(req, res, next) {
    var licence_key = req.user.licence_key;
    storage.getEmail(licence_key).then(function(email) {
        return res.status(200).json({
            email: email
        });
    }).otherwise(function(err) {
        return next(new NotFound(err, req.path));
    });
}

/**
 * @param {Object} req.body - request body Object
 * @param {String} req.user.licence_key - your api licence_key
 * @param {String} req.body.json
 * @param {String} req.body.lat -then input latitude.
 * @param {String} req.body.long - the input longitude
 * @param {String} req.body.email_id - email id
 * @param {String} req.body.address - address
 * @param {String} req.body.device_token -  your mobile device_token
 * @return HTTP 200 if your call submitted successfully
 * @throws {@link NotFound} if no email found
 * @throws {@link MissedParams} if no input email id
 * @throws {@link ServerError} if cannot send email
 * @example message: 'email sent successfully'
 * POST  /email
 * @memberof API
 */
function sendEmail(req, res, next) {
    var email = {};
    var missingParams = [];
    email.licence_key = req.user.licence_key;
    email.body = req.body.json;
    email.lat = req.body.lat;
    email.long = req.body.long;
    email.address = req.body.address;
    email.email_id = req.body.email_id || missingParams.push("email_id");
    email.device_token = req.body.device_token;
    if (missingParams.length > 0) {
        return next(new MissedParams(req.path, missingParams));
    }
    storage.getEmail2(email.email_id).then(function(result) {
        storage.insertEmail(result.subject, result.destination, email).then(function(email) {
            return res.status(200).json({});
        }).otherwise(function(error) {
            return next(new ServerError(error, req.path));
        });
    }).otherwise(function(error) {
        return next(new NotFound(error, req.path));
    });
}


module.exports = {
    getEmail: getEmail,
    sendEmail: sendEmail
}
