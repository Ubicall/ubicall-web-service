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

/**
 * update agent profile , password till now
 * @return {@link MissedParams} if @param currentPass not provide
 * @return {@link ServerError} if storage.updateAgent failed
 * @return HTTP status - 200 when agent profile updated successfully
 * @example {message : "Your Info updated"}
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
      return res.status(200).json({message : "Your Info updated"});
    }).otherwise(function(error){
      log.error('error : ' + error);
      return next(new ServerError(error, req.path));
  });
}

/**
 * update agent image only
 * @return {@link MissedParams} if @param image not provide
 * @return {@link ServerError} if storage.updateAgentImage failed
 * @return HTTP status - 200 when agent profile updated successfully
 * @example {message : "Your Info updated"}
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
