var when = require("when");
var moment = require("moment");
var schedule = require("node-schedule");
var settings = require("../settings");
var log = require("../log");
var storage = require("./storage");

var aggregateEvery, aggregateFrom;
var DEVENV = (process.env.node_env === "development" || process.env.node_env === "test");
if (DEVENV) {
    aggregateEvery = 2 * 60 * 1000; // 2 minutes
    aggregateFrom = 3; // startDate of aggregate will be now - aggregateFrom
} else {
    aggregateEvery = 5 * 60 * 1000; // 5 minutes
    aggregateFrom = 10; // startDate of aggregate will be now - aggregateFrom
}
log.info("aggregate logs every %s minutes and aggregate last %s minutes", (aggregateEvery / (60 * 1000)), aggregateFrom);

function initStrorage(_settings) {
    process.title = "api-access";
    // process.execArgv.push("--debug-brk=5858");
    log.info("Server use configuration version " + process.env.config_version);
    log.info("Server running now on " + process.env.node_env + " Mode - Avialable options are : test ,development ,production ");
    log.info("DB connections use " + process.env.db_env + " Mode - Avialable options are : internal ,external ");
    log.help("To stop app gracefully just type in shell pkill api-access");
    return when.resolve(storage.init(_settings));
}

initStrorage(settings).then(function() {
    setInterval(function() {
        var startDate = moment(startDate).subtract(aggregateFrom, "minutes").toDate();
        var endDate = moment().toDate();
        storage.aggregateLogs(startDate, endDate).then(function() {
            log.info("aggregate Logs done successfully " + startDate + " To " + endDate);
        }).otherwise(function(err) {
            //log.info("nothing to aggregate " + startDate + " To " + endDate);
        });
    }, aggregateEvery);
}).otherwise(function(err) {
    log.prompt("[background aggregator] IS DOWN NOW, reason %s", err.toString());
    process.exit(1);
});


module.exports = {
    init: function(_settings) {
        return initStrorage(_settings);
    }
};