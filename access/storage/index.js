var storageModule;

module.exports = {
    init: function(settings) {
        storageModule = require("./mongo");
        return storageModule.init(settings);
    },
    logRequest: storageModule.logRequest,
    limitExceeded: storageModule.limitExceeded,
    clearLogs: storageModule.clearLogs,
    clearReports: storageModule.clearReports,
    getLogs: storageModule.getLogs,
    getReports: storageModule.getReports,
    aggregateLogs: storageModule.aggregateLogs,

    _insertReports: storageModule._insertReports
};