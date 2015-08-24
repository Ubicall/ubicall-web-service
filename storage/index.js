// inspired from https://github.com/node-red/node-red/tree/master/red/storage
var when = require('when');
var log = require('../log');
var ubicallStorageModule, astStorageModule, cacheModule, cache;


function _initStorage(_settings) {
  var toReturnPromises = [];
  if (_settings.storage && _settings.storage.ubicallStorageModule) {
    if (typeof _settings.storage.ubicallStorageModule === "string" && _settings.storage.ubicallStorageModule == "mysql") {
      ubicallStorageModule = require("./musql/ubicall.js");
      astStorageModule = require("./mysql/ast_rt.js");
      webFSStorageModule = require("./musql/web_fs_db.js");
      toReturnPromises.push(ubicallStorageModule.init(_settings));
      toReturnPromises.push(astStorageModule.init(_settings));
      toReturnPromises.push(webFSStorageModule.init(_settings));
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
        return resolve(call);
      }).otherwise(function(error) {
        return reject(error);
      });

    });
  },

  scheduleDemoCall: function(call) {
    return when.promise(function(resolve, reject) {
      return ubicallStorageModule.scheduleDemoCall(call).then(function(call) {
        return resolve(call);
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  },

  getDevice: function(token) {
    return when.promise(function(resolve, reject) {

      return ubicallStorageModule.getDevice(token).then(function(device) {

        return resolve(device);
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  },

  getClient: function(key) {
    return when.promise(function(resolve, reject) {
      return ubicallStorageModule.getClient(key).then(function(client) {
        if(!client){
          return reject('no client found');
        }
        else{
        return resolve(client);
      }
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  },

  cancelCall: function(callId) {
    return when.promise(function(resolve, rejcet) {

      ubicallStorageModule.cancelCall(callId).then(function(call) {
        return resolve(call);
      }).otherwise(function(error) {
        return rejcet(error);
      });
    });
  },

  getAccountInfo: function(key) {
    return when.promise(function(resolve, reject) {

      ubicallStorageModule.getAccountInfo(key).then(function(company) {
        return resolve(company);
      }).otherwise(function(error) {
        return reject(error);
      });

    });
  },

  getVersion: function(key) {
    return when.promise(function(resolve, reject) {

      ubicallStorageModule.getVersion(key).then(function(version) {
        return resolve(version);
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  },

  getAdmin:function(key){
    return when.promise(function(resolve,reject){
      ubicallStorageModule.getAdmin(key).then(function(admin){
        return resolve(admin);
      }).otherwise(function(error){
        return reject(error);
      });
    });
  },
  getQueue:function(id){
    return when.promise(function(resolve,reject){
      ubicallStorageModule.getQueue(id).then(function(queue){
        return resolve(queue);
      }).otherwise(function(error){
        return reject(error);
      });
    });
  },
  findQueue: function(key) {
    return when.promise(function(resolve, reject) {

      ubicallStorageModule.getAdmin(key).then(function(admin) {
        if(admin)
        {
          admin_id = admin.id;
          ubicallStorageModule.getQueue(admin_id).then(function(queue){
            if(queue){
              return resolve(queue);
            }
          }).otherwise(function(error){
            return reject(error);
          });
        }

    }).otherwise(function(error){
      return reject(error);
    });
  });
  },

  feedback: function(data) {
    return when.promise(function(resolve, rejcet) {
      ubicallStorageModule.feedback(data).then(function(feedback) {

        return resolve(feedback);
      }).otherwise(function(error) {
        return rejcet(error);
      });
    });
  },

  updateIVR: function(data) {
    return when.promise(function(resolve, rejcet) {
      ubicallStorageModule.updateIVR(data).then(function(ivr) {

        return resolve(ivr);
      }).otherwise(function(error) {
        return rejcet(error);

      });
    });
  },

  createSip: function(data, password , domain, sip) {
    return when.promise(function(resolve, reject) {
    ubicallStorageModule.createSip(data, password , domain, sip).then(function(device) {
      return resolve(device);
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  },



  incrementClientCount: function(clientId) {
    return when.promise(function(resolve, reject) {
      ubicallStorageModule.incrementClientCount(clientId).then(function(client) {
          return resolve(client)
        }).otherwise(function(error) {
          return reject(error);
        });
      });
  },

  getClients: function(data) {
    return when.promise(function(resolve, rejcet) {
      ubicallStorageModule.getClients().then(function(clients) {
        return resolve(clients);
      }).otherwise(function(error) {
        return rejcet(error);
      });
    });
  },

  getIVR : function(license_key){
    return when.promise(function(resolve,reject){
      ubicallStorageModule.getIVR(license_key).then(function(ivr) {
        return resolve(ivr);
      }).otherwise(function(error) {
        return rejcet(error);
      });
    });
  },

  createSipFriend: function(sip , password) {
    return when.promise(function(resolve, reject) {
      astStorageModule.createSipFriend(sip , password).then(function(result) {
        return resolve(result);
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  } ,

  createSipDirectory : function(sip , password , dialString){
    return when.promise(function(resolve,reject){
      var _directory;
      webFSStorageModule.createSipDirectory(sip).then(function(directory){
        _directory = directory;
        webFSStorageModule.createSipDirectoryParams(directory , password , dialString).then(function(dp1,dp2){
          return resolve(_directory);
        }).otherwise(function(error){
            return rejcet(error);
        });
      }).otherwise(function(error){
        return rejcet(error);
      });
    });
  },

};


module.exports = storageModuleInterface;
