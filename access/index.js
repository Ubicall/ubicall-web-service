var when = require("when");
var moment = require("moment");
var schedule = require("node-schedule");
var settings = require("../settings");
var log = require("../log");
var storage = require("./storage");


function initStrorage(_settings) {
    process.title = "api-access";
    // process.execArgv.push("--debug-brk=5858");
    log.info("Server use configuration version " + process.env.config_version);
    log.info("Server running now on " + process.env.node_env + " Mode - Avialable options are : test ,development ,production ");
    log.info("DB connections use " + process.env.db_env + " Mode - Avialable options are : internal ,external ");
    log.help("To stop app gracefully just type in shell pkill api-access");
    return when.resolve(storage.init(_settings));
}

function startAggregate() {
    var today = moment().startOf("day").toDate();
    var _startDate = moment().startOf("hour");
    var startDate = moment(_startDate).toDate();
    var endDate = moment(_startDate).add(1, "hours").toDate();
    storage.aggregateLogs(today, startDate, endDate).then(function(status) {
        log.info("status : %s", status);
    }).otherwise(function(err) {
        log.error("error %s", err);
    });
}

initStrorage(settings) /*.then(storage.logFakeRequests)*/ .then(function() {
    // cron job for every hour => 0 */1 * * *
    // cron job for every 5 minute => */5 * * * *
    var j = schedule.scheduleJob("*/1 * * * *", startAggregate);
}).otherwise(function(err) {
    log.prompt("[background aggregator] IS DOWN NOW, reason %s", err.toString());
    process.exit(1);
});


module.exports = {
    init: function(_settings) {
        return initStrorage(_settings);
    }
};