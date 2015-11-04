// inspired from https://github.com/node-red/node-red/tree/master/red/storage
var when = require("when");
var log = require("../log");
var agentInterface = require("./agent");
var callInterface = require("./call");
var ubicallStorageModule, astStorageModule, webFSStorageModule, cacheModule, cache;


function _initStorage(_settings) {
    var toReturnPromises = [];
    if (_settings.storage && _settings.storage.ubicallStorageModule) {
        if (typeof _settings.storage.ubicallStorageModule === "string" && _settings.storage.ubicallStorageModule === "mysql") {
            ubicallStorageModule = require("./mysql/ubicall.js");
            astStorageModule = require("./mysql/ast_rt.js");
            webFSStorageModule = require("./mysql/web_fs_db.js");
            toReturnPromises.push(ubicallStorageModule.init(_settings));
            toReturnPromises.push(astStorageModule.init(_settings));
            toReturnPromises.push(webFSStorageModule.init(_settings));
        } else {
            throw new Error("unsupport storage");
        }
        toReturnPromises.push(agentInterface.init(ubicallStorageModule, astStorageModule, cacheModule, cache));
        toReturnPromises.push(callInterface.init(ubicallStorageModule, astStorageModule, cacheModule, cache));
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
                cacheModule = require("../caching");
                promises.push(cacheModule.init(_settings));
            }
        } catch (e) {
            log.error("SMI:error " + e);
            return when.reject(e);
        }

        return when.all(promises);
    },
    getHours: function(id) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.getHours(id).then(function(result) {
                return resolve(result);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },
    getEmail: function(licence_key) {
        return when.promise(function(resolve, reject) {
            return ubicallStorageModule.getEmail(licence_key).then(function(result) {
                return resolve(result);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },

    getEmail2: function(email_id) {
        return when.promise(function(resolve, reject) {
            return ubicallStorageModule.getEmail2(email_id).then(function(result) {
                return resolve(result);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },

    insertEmail: function(email, subject, destination) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.insertEmail(email, subject, destination).then(function(email) {
                return resolve(email);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
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
            if (!token) {
                return reject("undefined device_token");
            }
            return ubicallStorageModule.getDevice(token).then(function(device) {
                return resolve(device);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },

    getClient: function(key) {
        return when.promise(function(resolve, reject) {
            if (!key) {
                return reject("undefined licence_key");
            }
            return ubicallStorageModule.getClient(key).then(function(client) {
                return resolve(client);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },

    cancelCall: function(callId) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.cancelCall(callId).then(function() {
                return resolve();
            }).otherwise(function(error) {
                return reject(error);
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
    getQueueCallsCount: function(queue) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.getQueueCallsCount(queue).then(function(count) {
                return resolve(count);
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

    getAdmin: function(key) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.getAdmin(key).then(function(admin) {
                return resolve(admin);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },
    getAdminQueues: function(adminID) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.getAdminQueues(adminID).then(function(queue) {
                return resolve(queue);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },

    findAdminQueues: function(key) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.getAdmin(key).then(function(admin) {
                ubicallStorageModule.getAdminQueues(admin.id).then(function(queue) {
                    return resolve(queue);
                }).otherwise(function(error) {
                    return reject(error);
                });
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },

    feedback: function(data) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.feedback(data).then(function(feedback) {
                return resolve(feedback);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },
    updateIVR: function(ivr) {
        return when.promise(function(resolve, reject) {
            return ubicallStorageModule.updateIVR(ivr).then(function(_ivr) {
                return resolve(_ivr);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },

    createSip: function(device, password, domain, sip) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.createSip(device, password, domain, sip).then(function(device) {
                return resolve(device);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },



    incrementClientCount: function(clientId) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.incrementClientCount(clientId).then(function(client) {
                return resolve(client);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },

    getClients: function(data) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.getClients().then(function(clients) {
                return resolve(clients);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },

    getIVR: function(license_key) {
        return when.promise(function(resolve, reject) {
            ubicallStorageModule.getIVR(license_key).then(function(ivr) {
                return resolve(ivr);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },

    createSipFriend: function(sip, password) {
        return when.promise(function(resolve, reject) {
            astStorageModule.createSipFriend(sip, password).then(function(result) {
                return resolve(result);
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },

    createSipDirectory: function(sip, password) {
        return when.promise(function(resolve, reject) {
            var _directory;
            webFSStorageModule.createSipDirectory(sip).then(function(directory) {
                _directory = directory;
                webFSStorageModule.createSipDirectoryParams(directory, password).then(function(dp1, dp2) {
                    return resolve(_directory);
                }).otherwise(function(error) {
                    return reject(error);
                });
            }).otherwise(function(error) {
                return reject(error);
            });
        });
    },
    getCalls: agentInterface.getCalls,
    getQueues: agentInterface.getQueues,
    updateAgent: agentInterface.updateAgent,
    updateAgentImage: agentInterface.updateAgentImage,
    getCallDetail: callInterface.getCallDetail,
    getCall: callInterface.getCall,
    markCallDone: callInterface.markCallDone,
    markCallFail: callInterface.markCallFail
};


module.exports = storageModuleInterface;