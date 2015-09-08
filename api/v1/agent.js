/**
* agent main functionality
* @version 0.0.1
* @module api/v1/agent
* @exports .
* @namespace agent
*/
var when = require('when');
var request = require('request');
var validator = require('validator');
var settings = require('../../settings');
var storage = require('../../storage');
var log = require('../../log');
var NotImplementedError = require('./utils/errors').NotImplementedError;
var BadRequest = require('./utils/errors').BadRequest;
var MissedParams = require('./utils/errors').MissedParams;
var Forbidden = require('./utils/errors').Forbidden;
var ServerError = require('./utils/errors').ServerError;
var NotFound = require('./utils/errors').NotFound;


/**
 * get calls for authenticated agent
 * @see [api/v1/utils/midware#isAuthenticated](middleware.html#.isAuthenticated)
 * @param {Integer} page - url param page to get @default **1**
 * @param {Integer} per_page - url param number of result per page @default **20**
 * @throws {@link ServerError} if storage.getCalls failed
 * @return HTTP status - 200 with agent calls as json
 * @example
 * // returns {[{{id : 'xx' , phone : 'xxxxx'} , call ...call}] }
 * GET /agent/calls
 * @memberof API
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
 * get queues for authenticated agent
 * @see [api/v1/utils/midware#isAuthenticated](middleware.html#.isAuthenticated)
 * @return {@link ServerError} if storage.getQueues failed
 * @return HTTP status - 200 with agent queues as json
 * @example
 * // returns {[{{id : 'xx' , name : 'xxxxx'} , queue ...queue}] }
 * GET /agent/queues
 * @memberof API
 */
function getQueues(req, res, next) {
  storage.getQueues(req.user).then(function(queues) {
    return res.status(200).json(queues);
  }).otherwise(function(error) {
    log.error('error : ' + error);
    return next(new ServerError(error, req.path));
  });
}

/**
 * update agent profile , password till now
 * @see [api/v1/utils/midware#isAuthenticated](middleware.html#.isAuthenticated)
 * @param {Object} body - request body
 * @param {String} body.currentPass - agent current password
 * @param {String} body.newPass - agent new password
 * @return {@link MissedParams} if @param body.currentPass is missed
 * @return {@link MissedParams} if @param body.newPass is missed
 * @return {@link ServerError} if storage.updateAgent failed
 * @return HTTP status - 200 when agent profile updated successfully
 * @example
 * // returns {message : "Your info updated"}
 * POST /agent
 * PUT /agent
 * @memberof API
 */
function update(req,res,next){
  var update = {};
  update.currentPass = req.body.currentPass;
  if(req.body.newPass){
    update.newPass = req.body.newPass;
  }
  if(!update.currentPass){
    return next(new MissedParams(req.path, "currentPass"));
  }
  storage.updateAgent(req.user ,update).then(function(done){
      return res.status(200).json({message : "Your info updated"});
    }).otherwise(function(error){
      log.error('error : ' + error);
      return next(new ServerError(error, req.path));
  });
}

/**
 * update agent image only
 * @param {Object} req.file - request file object contain your uploaded image
 * @return {@link MissedParams} if @param req.file not provide
 * @return {@link ServerError} if storage.updateAgentImage failed
 * @return HTTP status - 200 when agent profile updated successfully
 * @example
 * //returns {message : "Your Info updated"}
 * POST /agent/image
 * PUT /agent/image
 * @memberof API
 */
function updateImage(req,res,next){
  if(!req.file){
    return next(new MissedParams(req.path, "image"));
  }
  var image = settings.cdn.agent.avatarHost + req.file.name;
  storage.updateAgentImage(req.user,image).then(function(){
    return res.status(200).json({message : "Your Image updated"});
  }).otherwise(function(error){
    log.error('error : ' + error);
    return next(new ServerError(error, req.path));
  });
}

module.exports = {
  queues: getQueues,
  calls: getCalls,
  update:update,
  updateImage:updateImage
}
