var when = require("when");
var settings;
var cacheModule;


function moduleSelector(_settings) {
    var toReturn;
    if (_settings.cache && _settings.cache.enabled) {
        if (typeof _settings.cache.cacheModule === "string") {
            toReturn = require("./" + _settings.cache.cacheModule);
        } else {
            toReturn = require("./redis.js");
        }
    } else {
        toReturn = require("./redis.js");
    }
    return toReturn;
}

var storageModuleInterface = {
    init: function(_settings) {
        settings = _settings;

        try {
            cacheModule = moduleSelector(_settings);
        } catch (e) {
            return when.reject(e);
        }

        return cacheModule.init(settings);
    },
    clear: function() {
        return cacheModule.clear();
    },
    addCalls: function(agent, calls) {
        return cacheModule.addCalls(agent, calls);
    },
    getCalls: function(agent) {
        return cacheModule.getCalls(agent);
    },
    addQueues: function(agent, queues) {
        return cacheModule.addQueues(agent, queues);
    },
    removeQueue: function(agent, queueid) {
        return cacheModule.removeQueue(agent, queueid);
    },
    updateQueue: function(agent, queueid, options) {
        return cacheModule.updateQueue(agent, queueid, options);
    },
    getQueues: function(agent) {
        return cacheModule.getQueues(agent);
    },
    addAgent: function(email, agent) {
        return cacheModule.addAgent(email, agent);
    },
    getAgent: function(email) {
        return cacheModule.getAgent(email);
    },
    getCurrentCall: function(agent) {
        return cacheModule.getCurrentCall(agent);
    },
    setCurrentCall: function(agent, call) {
        return cacheModule.setCurrentCall(agent, call);
    },
    clearCurrentCall: function(agent) {
        return cacheModule.clearCurrentCall(agent);
    }
};

module.exports = storageModuleInterface;