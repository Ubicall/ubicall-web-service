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
 var NotImplementedError = require("./utils/errors").NotImplementedError;
 var BadRequest = require("./utils/errors").BadRequest;
 var MissedParams = require("./utils/errors").MissedParams;
 var Forbidden = require("./utils/errors").Forbidden;
 var ServerError = require("./utils/errors").ServerError;
 var NotFound = require("./utils/errors").NotFound;
/**
 * @return HTTP status - 200
 * @return HTTP status - 404 {@link NotFound} If can"t return queue data
 * @example
 * [{"id":"XXX",
  "name":"XXXX"
  }]
 */
function fetchAdminQueues(req, res, next) {
  console.log('here');
    var key = req.user.licence_key;
    console.log('key',key);
    storage.findAdminQueues(key).then(function(queues) {
        return res.status(200).json(queues);
    }).otherwise(function(error) {
        return next(new Forbidden(error, req.originalUrl));
    });
};


module.exports = {
    fetchAdminQueues: fetchAdminQueues
};
