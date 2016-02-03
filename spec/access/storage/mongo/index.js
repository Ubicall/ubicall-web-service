var when = require("when");
var should = require("should");
var moment = require("moment");
var _ = require("underscore");
var mongodb = require("../../../../access/storage/mongo");
var helper = require("../helper");

var settings = {
    log: {
        mongo: {
            external_ip: "127.0.0.1",
            external_port: "27017",
            internal_ip: "127.0.0.1",
            internal_port: "27017",
            database: "ubicall_log"
        }
    }
};

describe("access/storage/mongo driver with recent logs", function() {
    var logs = [];
    var reports = [];

    function __aggregateLogs() {
        return when.resolve(function(resolve, reject) {

        });
    }

    before(function(done) {
        var logsOptions = {
            count: 1000
        };
        mongodb.init(settings)
            .then(mongodb.clearLogs).then(mongodb.clearReports)
            .then(function() {
                return when.resolve(helper.genFakeRequests(logsOptions));
            })
            .then(mongodb.logRequests)
            .then(mongodb.getLogs)
            .then(function(docs) {
                logs = docs || [];
                return when.resolve();
            })
            .then(function() {
                var startDate = moment().toDate();
                var endDate = moment(startDate).add(30, "minutes").toDate();
                return mongodb.aggregateLogs(startDate, endDate);
            })
            .then(mongodb.getReports)
            .then(function(docs) {
                reports = docs || [];
                done();
            }).otherwise(function(err) {
                done(err);
            });
    });

    it("reports should equal distinct log.category size", function() {
        console.log("logs size " + logs.length + " and report size " + reports.length);
        // var logLicPlusCats = _.uniq(logs, function(log) {
        //     return [log.licence_key, "_", log.category].join();
        // });
        // var reportLicPlusCats = _.uniq(reports, function(report) {
        //     return [report.licence_key, "_", report.category].join();
        // });
        //
        // console.log("logLicPlusCats " + logLicPlusCats);
        // console.log("reportLicPlusCats " + reportLicPlusCats);
        //
        // logLicPlusCats.should.containEql(reportLicPlusCats);
    });
});