var mongoose = require("mongoose");
var CronJob = require("cron").CronJob;
var settings = require("../settings");
var storage = require("../storage");
var log = require("../log");



storage.init(settings).then(function() {
    storage.aggregateLogs().then(function(time) {
        log.info("aggregate done for %s at %s", time.day, time.hour);
    }).otherwise(function(err) {
        log.error("error => %s", err);
    });
    // var job = new CronJob("* * * * * *", storage.aggregateLogs, null, true);
});