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
  getCalls: function(agent,options) {
    return when.resolve(ubicallStorageModule.getCalls(agent,options));
  },
  getQueues: function(agent) {
    return when.resolve(ubicallStorageModule.getQueues(agent));
  },
  updateAgent: function(agent,data){
    return when.resolve(ubicallStorageModule.updateAgent(agent,image));
  },
  updateAgentImage: function(agent , image){
    return when.resolve(ubicallStorageModule.updateAgentImage(agent,image));
  }
};


module.exports = agentInterface;
