var storageModule = require("./mongo");

module.exports = {
    init: storageModule.init,
    logRequest: storageModule.logRequests,
    limitExceeded: storageModule.limitExceeded,
    clearLogs: storageModule.clearLogs,
    clearReports: storageModule.clearReports,
    getLogs: storageModule.getLogs,
    getReports: storageModule.getReports,
    aggregateLogs: storageModule.aggregateLogs,

    _insertReports: storageModule._insertReports
};