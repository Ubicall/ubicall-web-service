// inspired from https://github.com/node-red/node-red/tree/master/red/storage
var when = require('when');
var log = require('../log');
var ubicallStorageModule, astStorageModule, cacheModule, cache;


function _initStorage(_settings) {
  var toReturnPromises = [];
  if (_settings.storage && _settings.storage.ubicallStorageModule) {
    if (typeof _settings.storage.ubicallStorageModule === "string" && _settings.storage.ubicallStorageModule == "mysql") {
      ubicallStorageModule = require("./" + _settings.storage.ubicallStorageModule + "/ubicall.js");
      astStorageModule = require("./" + _settings.storage.ubicallStorageModule + "/ast_rt.js");
      toReturnPromises.push(ubicallStorageModule.init(_settings));
      toReturnPromises.push(astStorageModule.init(_settings));
    } else {
      throw new Error("unsupport storage")
    }
    return when.all(toReturnPromises);
  }
}

var storageModuleInterface = {
  init: function(_settings) {
    var promises = [];
    try {
      promises.push(_initStorage(_settings));
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

      return ubicallStorageModule.scheduleCall(call).then(function(call) {

        log.info('return from index storage', call);
        if (cache) {
          // TODO add this call to cache
        }
        return resolve(call);
      }).otherwise(function(error) {
        return reject(error);
      });

    });
  },

  scheduleDemoCall: function(call) {
    return when.promise(function(resolve, reject) {

      return ubicallStorageModule.scheduleDemoCall(call).then(function(call) {

        if (cache) {
          //TODO
        }
        return resolve(call);
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  },

  getDevice: function(token) {
    return when.promise(function(resolve, reject) {

      return ubicallStorageModule.getDevice(token).then(function(device) {

        if (cache) {
          //TODO
        }
        return resolve(device);
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  },
  getClient: function(key) {
    return when.promise(function(resolve, reject) {

      return ubicallStorageModule.getClient(key).then(function(client) {

        if (cache) {
          //TODO
        }
        return resolve(client);
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  },

  cancelCall: function(callId) {
    return when.promise(function(resolve, rejcet) {

      ubicallStorageModule.cancelCall(callId).then(function(call) {

        if (cache) {
          // TODO update cache
        }
        return resolve(call);
      }).otherwise(function(error) {
        return rejcet(error);
      });
    });
  },
  getAccountInfo: function(key) {
    return when.promise(function(resolve, reject) {

      ubicallStorageModule.getAccountInfo(key).then(function(company) {

        if (cache) {
          //TODO update cache
        }
        return resolve(company);
      }).otherwise(function(error) {
        return reject(error);
      });

    });
  },

  getVersion: function(key) {
    return when.promise(function(resolve, reject) {

      ubicallStorageModule.getVersion(key).then(function(version) {

        if (cache) {
          //TODO update cahe
        }
        return resolve(version);
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  },

  getQueue: function(key) {
    return when.promise(function(resolve, rejcet) {

      ubicallStorageModule.getQueue(key).then(function(queue) {

        if (cache) {
          // TODO add cache
        }
        return resolve(queue);
      }).otherwise(function(error) {
        return rejcet(error);

      });
    });
  },

  feedback: function(data) {
    return when.promise(function(resolve, rejcet) {
      storageModule.feedback(data).then(function(feedback) {
        if (cache) {
          // TODO add cache
        }
        return resolve(feedback);
      }).otherwise(function(error) {
        return rejcet(error);
      });
    });
  },

  updateIVR: function(data) {
    return when.promise(function(resolve, rejcet) {
      storageModule.checkIVR(data).then(function(ivr) {
        if (cache) {
          // TODO add cache
        }
        return resolve(ivr);
      }).otherwise(function(error) {
        return rejcet(error);

      });
    });
  },

  insert_into_sip: function(data) {
    return when.promise(function(resolve, reject) {
      storageModule.insert_into_sip(data).then(function(device) {
        if (cache) {
          // TODO add cache
        }
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  },

  updateIVR: function(data) {
    return when.promise(function(resolve, rejcet) {
      ubicallStorageModule.checkIVR(data).then(function(ivr) {
        if (cache) {
          // TODO add cache
        }
        return resolve(ivr);
      }).otherwise(function(error) {
        return rejcet(error);

      });
    });
  },


  update_client: function(data) {
    return when.promise(function(resolve, reject) {
      storageModule.update_client(data).then(function(client) {
        if (cache) {
          // TODO add cache
        }
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  },
  getClients: function(data) {
    return when.promise(function(resolve, rejcet) {
      ubicallStorageModule.getClients().then(function(clients) {
        if (cache) {
          // TODO add cache
        }
        return resolve(clients);
      }).otherwise(function(error) {
        return rejcet(error);
      });
    });
  },


  insert_sipfriends: function(data) {
    return when.promise(function(resolve, reject) {
      storageModule.insert_sipfriends(data).then(function(result) {
        if (cache) {
          // TODO add cache
        }
      }).otherwise(function(error) {
        return reject(error);

      });
    });
  }

};


module.exports = storageModuleInterface;
