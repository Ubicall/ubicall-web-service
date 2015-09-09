var when = require('when');
var settings;


function moduleSelector(_settings) {
    var toReturn;
    if (_settings.infra) {
        if (typeof _settings.infra.communicationModule === "string") {
            toReturn = require("./" + _settings.infra.communicationModule);
        } else {
            toReturn = require("./freeswitch");
        }
    } else {
        toReturn = require("./freeswitch");
    }
    return toReturn;
}

var communicationModuleInterface = {
    init: function (_settings) {
        settings = _settings;
        try {
            communicationModule = moduleSelector(_settings);
        } catch (e) {
            return when.reject(e);
        }
        return communicationModule.init(settings);
    },
    call: function (call,agent) {
      return when.promise(function(resolve,reject){
        return communicationModule.call(call, agent).then(function(){
          return resolve({});
        }).otherwise(function(error){
          return reject(error);
        });
      });
    }
};

module.exports = communicationModuleInterface;
