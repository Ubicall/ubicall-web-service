var when = require('when');
var request = require('request');
var validator = require('validator');
var settings = require('../../settings');
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('../errors').NotImplementedError;
var BadRequest = require('../errors').BadRequest;
var MissedParams = require('../errors').MissedParams;
var Forbidden = require('../errors').Forbidden;
var ServerError = require('../errors').ServerError;
var NotFound = require('../errors').NotFound;


/**
 * get calls for agent with id @param agent_id
 * @param {Integer} page - page to get @default 1
 * @param {Integer} per_page - number of result per page @default 20
 * @return {@link Forbidden} if user not provide
 * @return {@link ServerError} if storage.getCalls failed
 * @return HTTP status - 200 with agent calls as json
 */
function getCalls(req, res, next) {
  var options = {};
  options.page = req.query.page || 1;
  options.per_page = req.query.per_page || 20;
  storage.getCalls(req.user, options).then(function(calls) {
    return res.status(200).json(calls);
  }).otherwise(function(error) {
    log.error('error : ' + error);
    return next(new ServerError(error, req.path));
  });
}

/**
 * get queues for agent with id @param agent_id
 * @return {@link Forbidden} if user not provide
 * @return {@link ServerError} if storage.getQueues failed
 * @return HTTP status - 200 with agent queues as json
 */
function getQueues(req, res, next) {
  storage.getQueues(req.user).then(function(queues) {
    return res.status(200).json(queues);
  }).otherwise(function(error) {
    log.error('error : ' + error);
    return next(new ServerError(error, req.path));
  });
}

module.exports = {
  queues: getQueues,
  calls: getCalls
}
