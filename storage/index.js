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

};

module.exports = storageModuleInterface;