var mongoose = require("mongoose");
var CronJob = require("cron").CronJob;
var settings = require("../settings");
var storage = require("../storage");
var log = require("../log");

function aggregateLogs() {
    log.info("aggregating logs");
}

storage.init(settings).then(function() {
    var job = new CronJob("* * * * * *", aggregateLogs, null, true);
});