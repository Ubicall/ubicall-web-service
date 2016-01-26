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
            var today = moment().startOf("day").toDate();
            var _startDate = moment().startOf("hour");
            var startDate = moment(_startDate).toDate();
            var endDate = moment(_startDate).add(1, "hours").toDate();
            mongodb.aggregateLogs(today, startDate, endDate).then(function() {
                return resolve();
            }).otherwise(function(err) {
                return reject();
            });
        });
    }

    before(function(done) {
        mongodb.init(settings)
            .then(when.all([mongodb.clearLogs(), mongodb.clearReports()]))
            .then(mongodb.logRequests(helper.genRecentFakeRequest(1000)))
            .then(mongodb.getLogs().then(function(docs) {
                logs = docs || [];
                return when.resolve();
            }))
            .then(__aggregateLogs())
            .then(mongodb.getReports()).then(function(docs) {
                reports = docs || [];
                done();
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