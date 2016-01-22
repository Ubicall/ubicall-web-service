var storageModule;

module.exports = {
    init: function(settings){
      storageModule = require("./mongo");
      return storageModule.init(settings);
    },
    logRequest: storageModule.logRequest,
    limitExceeded: storageModule.limitExceeded,
    clearLog: storageModule.clearLog,
    clearReport: storageModule.clearReport,
    aggregateLogs: storageModule.aggregateLogs
};
