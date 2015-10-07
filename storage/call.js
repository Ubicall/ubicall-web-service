var when = require('when');
var log = require('../log');
var ubicallStorageModule, astStorageModule, cacheModule, cache;

var agentInterface = {
    init: function(_ubicallStorageModule, _astStorageModule, _cacheModule, _cache) {
        ubicallStorageModule = _ubicallStorageModule;
        astStorageModule = _astStorageModule;
        cacheModule = _cacheModule;
        cache = _cache;
        return when.resolve();
    },
    getCallDetail: function(agent, call_id) {
        return when.resolve(ubicallStorageModule.getCallDetail(agent, call_id));
    },
    getCall: function(agent, queue_id, queue_slug) {
        return when.resolve(ubicallStorageModule.getCall(agent, queue_id, queue_slug));
    },
    markCallDone: function(call) {
        return when.resolve(ubicallStorageModule.markCallDone(call));
    },
    markCallFail: function(call, agent, options) {
        return when.resolve(ubicallStorageModule.markCallFail(call));
    }
};


module.exports = agentInterface;