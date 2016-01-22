var when = require("when");
var moment = require("moment");
var logSchema = require("./models/log");
var reportsSchema = require("./models/report");
var log = require("../../../log");
var $log, $report;


function getApiHitsClientsWithin(startDate, endDate) {
    return when.promise(function(resolve, reject) {
        $log.distinct("licence_key", {
            datetime: {
                "$gte": startDate,
                "$lt": endDate
            }
        }, function(err, licence_keys) {
            if (err) {
                return reject(err);
            }
            return resolve(licence_keys || []);
        });
    });
}

function getApiHitsStatsPerLicenceKey(licence_key, startDate, endDate) {
    return when.promise(function(resolve, reject) {
        var pipeline = [{
            $match: {
                licence_key: licence_key,
                datetime: {
                    "$gte": startDate,
                    "$lt": endDate
                }
            }
        }, {
            $group: {
                _id: "$category",
                count: {
                    "$sum": 1
                }
            }
        }];

        $log.aggregate(pipeline, function(err, res) {

            //[{_id : "ivr" , count : 30},
            // {_id : "ivr" , count : 30},
            //{_id : "ivr" , count : 30}]

            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });
}



function pushHitsPerHourOfItsCategory(licence_key, categories, day, startDate, endDate) {
    var promises = [];

    function pushHitsPerHourOfCategory(category) {
        var setObj = {};
        setObj["hourly." + startDate.getHours()] = category.count;

        return when.promise(function(resolve, reject) {
            $report.findOneOrCreate({
                licence_key: licence_key,
                category: category._id,
                datetime: {
                    "$eq": day
                }
            }, {
                licence_key: licence_key,
                category: category._id,
                datetime: day
            }, function(err, report) {
                if (err) {
                    return reject(err);
                }
                report.update({
                    "$set": setObj,
                    "$inc": {
                        count: category.count
                    }
                }, function(err, doc) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({
                        category: category._id,
                        count: category.count,
                        licence_key: licence_key
                    });
                });
            });
        });
    }

    for (var i = 0; i < categories.length; i++) {
        promises.push(pushHitsPerHourOfCategory(categories[i]));
    }

    var settled = when.settle(promises);

    settled.then(function(descriptors) {
        // awk '{s+=$17} END {print s}'
        // log.info("push stat between %s and %s for %s :", moment(startDate).format("hA"), moment(endDate).format("hA"), licence_key);
        descriptors.forEach(function(d) {
            if (d.state === "rejected") {
                log.error("error %s, licence_key", d.reason, licence_key);
            }
            // else {
            //     log.data("\t%s  => %s", d.value.category, d.value.count);
            // }
        });
        return when.resolve();
    });

}

function aggregateChanges(licence_keys, day, startDate, endDate) {

    function aggregateChangesPerLicence(licence_key) {
        return getApiHitsStatsPerLicenceKey(licence_key, startDate, endDate)
            .then(function(categories) {
                return pushHitsPerHourOfItsCategory(licence_key, categories, day, startDate, endDate);
            });
    }

    return when.promise(function(resolve) {
        var promises = [];

        for (var i = 0; i < licence_keys.length; i++) {
            promises.push(aggregateChangesPerLicence(licence_keys[i]));
        }

        var settled = when.settle(promises);

        settled.then(function(descriptors) {
            var failed = false;
            descriptors.forEach(function(d) {
                if (d.state === "rejected") {
                    failed = true;
                    log.error("error %s", d.reason);
                }
            });
            return resolve(failed ? "failed" : "success");
        });
    });
}

function aggregate() {
    return when.promise(function(resolve, reject) {

        var today = moment().startOf("day").toDate();
        var _startDate = moment().startOf("hour");
        var startDate = moment(_startDate).toDate();
        var endDate = moment(_startDate).add(1, "hours").toDate();

        log.info("start aggregate for %s logs between %s and %s", moment(today).format("dddd, MMMM Do YYYY"), moment(startDate).format("hA"), moment(endDate).format("hA"));
        log.info("aggregate start at %s ", moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
        getApiHitsClientsWithin(startDate, endDate).then(function(licence_keys) {
            // log.info("%s client hit servers between %s and %s", licence_keys.length, moment(startDate).format("ddd, hA"), moment(endDate).format("ddd, hA"));
            // log.data("client licence_keys: \n %s ", JSON.stringify(licence_keys, null, 4));
            aggregateChanges(licence_keys, today, startDate, endDate).then(function(status) {
                log.info("successfully end aggregate for %s logs between %s and %s", moment(today).format("dddd, MMMM Do YYYY"), moment(startDate).format("hA"), moment(endDate).format("hA"));
                log.info("aggregate end at %s ", moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
                return resolve(status);
            }).otherwise(function(err) {
                log.error("error occureed while aggregate for %s logs between %s and %s", moment(today).format("dddd, MMMM Do YYYY"), moment(startDate).format("hA"), moment(endDate).format("hA"));
                log.info("aggregate end at %s ", moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
                log.error("error %s", err);
                return reject(err);
            });
        }).otherwise(function(err) {
            return reject(err);
        });
    });
}

module.exports = {
    init: function(conn) {
        $log = conn.model("log", logSchema, "log");
        $report = conn.model("report", reportsSchema, "report");
        return when.resolve();
    },
    aggregateLogs: aggregate,
    clearReport: function() {
        return when.promise(function(resolve, reject) {
            $report.remove({}, function(err, done) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    },
};
