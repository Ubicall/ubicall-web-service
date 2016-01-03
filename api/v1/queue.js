/**
 * ivr main functionality
 * @version 0.0.1
 * @module api/v1/queue
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
 * @return HTTP status - 200
 * @return HTTP status - 404 {@link NotFound} If can"t return queue data
 * @example
 * [{"id":"XXX",
  "name":"XXXX"
  }]
 */
function fetchAdminQueues(req, res, next) {
    var key = req.user.licence_key;
    storage.findAdminQueues(key).then(function(queues) {
        return res.status(200).json(queues);
    }).otherwise(function(error) {
        return next(new Forbidden(error, req.originalUrl));
    });
}


module.exports = {
    fetchAdminQueues: fetchAdminQueues
};