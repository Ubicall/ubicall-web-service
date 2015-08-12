// inspired from https://github.com/node-red/node-red/tree/master/red/storage
var when = require('when');
var log = require('../log');
var storageModule, cacheModule, cache;


function moduleSelector(_settings) {
  var toReturn;
  if (_settings.storage && _settings.storage.storageModule) {
    if (typeof _settings.storage.storageModule === "string") {
      toReturn = require("./" + _settings.storage.storageModule + "Storage");
    } else {
      toReturn = _settings.storage.storageModule;
    }
  } else {
    toReturn = require("./mysqlStorage.js");
  }
  return toReturn;
}

var storageModuleInterface = {
  init: function(_settings) {
    var promises = [];
    try {
      storageModule = moduleSelector(_settings);
      promises.push(storageModule.init(_settings));
      if (_settings.cache && _settings.cache.enabled) {
        cache = _settings.cache.enabled;
        cacheModule = require('../caching');
        promises.push(cacheModule.init(_settings));
      }
    } catch (e) {
      log.error("SMI:error " + e);
      return when.reject(e);
    }

    return when.all(promises);
  },
  scheduleCall: function(call) {
    return when.promise(function(resolve, reject) {
      return storageModule.scheduleCall(call).then(function(call){
        if(cache){
            // TODO add this call to cache
        }
        return resolve(call);
      }).otherwise(function(error){
        return reject(error);
      });
    });
  },

  scheduleDemoCall:function(call){
    return when.promise(function(resolve,reject){
      return storageModule.scheduleDemoCall(call,device.sip).then(function(call){
        if(cache){
          //TODO
        }
        return resolve(call);
      }).otherwise(function(error){
        return reject(error);
      });
    });
  },

  getDevice:function(device){
    return when.promise(function(resolve,reject){
      return storageModule.getDevice(token).then(function(device){
        if(cache){
          //TODO
        }
        return resolve(device);
      }).otherwise(function(error){
        return reject(error);
      });
    });
  },
  getClient:function(client){
    return when.promise(function(resolve,reject){
      return storageModule.getClient(key).then(function(client){
        if(cache){
          //TODO
        }
        return resolve(client);
      }).otherwise(function(error){
        return reject(error);
      });
    });
  },

  cancelCall : function (callId){
    return when.promise(function(resolve,rejcet){
      storageModule.cancelCall(callId).then(function(call){
        if(cache){
            // TODO update cache
        }
        return resolve(call);
      }).otherwise(function(error){
        return rejcet(error);
      });
    });
  },
  getAccountInfo:function(key){
    return when.promise(function(resolve,reject){
      storageModule.getAccountInfo(key).then(function(company){
        if(cache){
          //TODO update cache
        }
        return resolve(company);
      }).otherwise(function(error){
        return reject(error);
      });

    });
  },

  getVersion:function(key){
    return when.promise(function(resolve,reject){
      storageModule.getVersion(key).then(function(version){
        if(cache){
          //TODO update cahe
        }
        return resolve(version);
      }).otherwise(function(error){
        return reject(error);
      });
    });

  }

};

module.exports = storageModuleInterface;
