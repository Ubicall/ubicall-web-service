var when = require('when');
var redis = require('redis');
var log = require('../log');
var _ = require('lodash');
var client;


var settings;
var DEFAULT_REDIS_SETTINGS = {
  host: "localhost",
  port: "6379",
  callsttl: 600,
  queuesttl: 600,
  // field used as key client.hmset(redisCallHashKey, ---hmsetFieldName--- , JSON.stringify(calls[i]));
  hmsetFieldName : "data"
}

function init(_settings) {
  return when.promise(function(resolve, reject) {
    settings = _settings;
    try {
      settings.cache = _settings.cache || {};
      settings.cache.redis = _settings.cache.redis || DEFAULT_REDIS_SETTINGS;
      settings.cache.redis.host = _settings.cache.redis.host || DEFAULT_REDIS_SETTINGS.host;
      settings.cache.redis.port = _settings.cache.redis.port || DEFAULT_REDIS_SETTINGS.port;
      settings.cache.redis.callsttl = _settings.cache.redis.callsttl || DEFAULT_REDIS_SETTINGS.callsttl;
      settings.cache.redis.queuesttl = _settings.cache.redis.queuesttl || DEFAULT_REDIS_SETTINGS.queuestt;
      settings.cache.redis.hmsetFieldName = _settings.cache.redis.hmsetFieldName || DEFAULT_REDIS_SETTINGS.hmsetFieldName;

      client = redis.createClient(settings.cache.redis.port , settings.cache.redis.host);

      log.info("redis:caching server " + settings.cache.redis.host + ":" + settings.cache.redis.port);

      client.on('error', function(err) {
        log.error('redis:error ' + err);
      });

      if(process.env.node_env != 'production'){
        clear().then(function(){
          log.info("redis:wipe all date");
        })
      }
    } catch (ex) {
      log.error('redis:error while connecting ' + ex.stack);
      return reject(ex);
    }
    return resolve(client);
  });
}

function clear(){
  return when.promise(function(resolve,reject){
    //This command never fails.
    client.flushdb(function(err,res){
      return resolve();
    })
  });
}

function addAgent(email, agent) {
  log.verbose("redis:hit addAgent");
  return when.promise(function(resolve, reject) {
    client.set(agent.email ,JSON.stringify(agent),function(err,res){
      if (err) {
        return reject('redis:addAgent error ' + err);
      }
      if (res) {
        return resolve(res)
      }else {
        return reject('redis:agent ' + email + ' not added to cache');
      }
    });
  });
}

function getAgent(email) {
  log.verbose("redis:hit getAgent" );
  return when.promise(function(resolve, reject) {
    client.get(email ,function(err,res){
      if (err) {
        return reject('redis:getAgent error ' + err);
      }
      if (res) {
        return resolve(JSON.parse(res))
      }else {
        return reject('redis:agent ' + email + ' not found in cache');
      }
    });
  });
}

function addCalls(agent, calls) {
  log.verbose("redis:hit addCalls");
  // more detail see http://stackoverflow.com/questions/6196647/want-to-store-in-redis-via-node-js/6197618#6197618
  return when.promise(function(resolve, reject) {
    var redisCallSetKey;
    var redisCallHashKey;
    for (var i = 0; i < calls.length; i++) {
      redisCallSetKey = agent.api_key + ":" + agent.email + ':calls';
      redisCallHashKey = agent.api_key + ":" + agent.email + ':call:' + calls[i].id;
      client.sadd(redisCallSetKey,redisCallHashKey);
      client.expire(redisCallSetKey , settings.cache.redis.callsttl);
      client.hmset(redisCallHashKey, settings.cache.redis.hmsetFieldName , JSON.stringify(calls[i]));
      client.expire(redisCallHashKey , settings.cache.redis.callsttl);
    }
    return resolve({});
  });
}

function getCalls(agent) {
  log.verbose("redis:hit getCalls" );
  return when.promise(function(resolve, reject) {
    client.smembers(agent.api_key + ":" + agent.email + ':calls', function(err, res) {
      if (err) {
        return reject('redis:getCalls error ' + err);
      }
      if (res && res.length > 0) {
        var calls = [];
        var promises = [];
        for (var i = 0; i < res.length; i++) {
          promises.push(_hgetall(res[i]));
        }
        var settled = when.settle(promises);
        settled.then(function(descriptors) {
            descriptors.forEach(function(d) {
              if(d.state === 'rejected') {
                log.verbose('redis:some calls not fetched correctly because' + d.reason.toString());
              } else {
                calls.push(d.value);
              }
            });
            return resolve(_.compact(calls))
        });
      } else {
          return reject('redis:no calls found for '+ agent.email);
      }
    });
  });
}

function addQueues(agent, queues) {
  log.verbose("redis:hit addQueues");
  return when.promise(function(resolve, reject) {
    var redisQueueSetKey;
    var redisQueueHashKey;
    for (var i = 0; i < queues.length; i++) {
      redisQueueSetKey = agent.api_key + ":" + agent.email + ':queues';
      redisQueueHashKey = agent.api_key + ":" + agent.email + ':queue:' + queues[i].queue_id;
      client.sadd(redisQueueSetKey,redisQueueHashKey);
      client.expire(redisQueueSetKey , settings.cache.redis.queuesttl);
      client.hmset(redisQueueHashKey, settings.cache.redis.hmsetFieldName ,JSON.stringify(queues[i]));
      client.expire(redisQueueHashKey , settings.cache.redis.queuesttl);
    }
    return resolve({});
  });
}

function getQueues(agent) {
  log.verbose("redis:hit getQueues" );
  return when.promise(function(resolve, reject) {
    client.smembers(agent.api_key + ":" + agent.email + ':queues', function(err, res) {
      if (err) {
        log.error(err);
        return reject(err);
      }
      if (res && res.length > 0) {
        var queues = [];
        var promises = [];
        for (var i = 0; i < res.length; i++) {
          promises.push(_hgetall(res[i]));
        }
        var settled = when.settle(promises);
        settled.then(function(descriptors) {
            descriptors.forEach(function(d) {
              if(d.state === 'rejected') {
                log.verbose('redis:some queues not fetched correctly because' + d.reason.toString());
              } else {
                queues.push(d.value);
              }
            });
            return resolve(_.compact(queues))
        });
      } else {
          return reject('redis:no queues found for '+ agent.email);
      }
    });
  });
}

function removeQueue(agent , queueid){
    log.verbose("redis:hit removeQueue" );
    return when.promise(function(resolve, reject) {
      var redisQueueSetKey = agent.api_key + ":" + agent.email + ':queues';
      var redisQueueHashKey = agent.api_key + ":" + agent.email + ':queue:' + queueid;
      client.srem(redisQueueSetKey , redisQueueHashKey , function(err,res){
        if(err){
          return reject("redis:srem("+redisQueueSetKey+","+redisQueueHashKey+") error " + error);
        }
        if (res) {
          client.del(redisQueueHashKey , function(err,res){
            if(err){
              return reject("Redis del("+redisQueueHashKey+") error " + error);
            }
            if(res){
              return resolve(res);
            }else {
              log.warn("redis:remove "+ redisQueueHashKey + " from " + redisQueueSetKey + " but not invalidate his hash");
              return resolve(res);
            }
          });
        }else {
          return reject('redis:agent '+ agent.email + 'has no queue with id ' + queueid + ' to be removed');
        }
      });
    });
}

function updateQueue(agent , queueid ,options){
  log.verbose("redis:hit updateQueue" );
  return when.promise(function(resolve,reject){
      var redisQueueHashKey = agent.api_key + ":" + agent.email + ':queue:' + queueid;
      return _hgetall(redisQueueHashKey).then(function(queue){
        queue.calls = queue.calls + options.calls;
        addQueues(agent,[queue]).then(function(){
          return resolve({});
        }).otherwise(function(err){
          return reject(err);
        });
      }).otherwise(function(err){
        return reject(err);
      })
  });
}

function _hgetall(key){
  return when.promise(function(resolve,reject){
    client.hgetall(key,function(error,result){
      if(error){
        return reject('redis:hgetall('+key+') error ' +error);
      }
      if (result && result[settings.cache.redis.hmsetFieldName]) {
        return resolve(JSON.parse(result.data));
      }else {
        return reject('redis: ' + key + ' has no ' + settings.cache.redis.hmsetFieldName + ' object');
      }
    });
  });
}

function getCurrentCall(agent){
  log.verbose("redis:hit getCurrentCall");
  return when.promise(function(resolve,reject){
    var currentCallKey = agent.api_key + ":" + agent.email + ":current_call";
    client.get(currentCallKey,function(err,res){
      if (err) {
        return reject('redis:get('+currentCallKey+') error ' +error);
      }
      if (res) {
        return resolve(JSON.parse(res));
      }else {
        return reject("redis:agent "+agent.email +" has no current call");
      }
    })
  });
}
function  setCurrentCall(agent,call){
  log.verbose("redis:hit setCurrentCall" );
  return when.promise(function(resolve,reject){
    // add this call as 'api_key:agent_email:"current_call"' --> call
    var currentCallKey = agent.api_key + ":" + agent.email + ":current_call";
    client.set(currentCallKey,JSON.stringify(call),function(err,res){
      if (err) {
        return reject('redis:set('+currentCallKey+') error ' +error);
      }
      if (res) {
        return resolve(res)
      }else {
        return reject("redis:not able to set current call for agent "+agent.email );
      }
    })
  });
}

function clearCurrentCall(agent){
  log.verbose("redis:hit clearCurrentCall" );
  return when.promise(function(resolve,reject){
    var currentCallKey = agent.api_key + ":" + agent.email + ":current_call";
    client.del(currentCallKey,function(err,res){
      if (err) {
        return reject('redis:del('+currentCallKey+') error ' +error);
      }
      if (res) {
        return resolve(res)
      }else {
        return reject("redis:"+agent.email+' has no current cached call');
      }
    })
  });
}

module.exports = {
  init: init,
  clear: clear,
  getCalls: getCalls,
  addCalls: addCalls,
  addQueues: addQueues,
  getQueues: getQueues,
  updateQueue: updateQueue,
  removeQueue: removeQueue,
  getAgent: getAgent,
  addAgent: addAgent,
  getCurrentCall: getCurrentCall,
  setCurrentCall: setCurrentCall,
  clearCurrentCall: clearCurrentCall

}
