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

/**
 * @return
 *  [
 *    {_id : "ivr" , count : 27},
 *    {_id : "call" , count : 53},
 *    {_id : "integration" , count : 80}
 *  ]
 **/
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
        function findReport() {
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
                }).then(function(report) {
                    return resolve(report);
                }).otherwise(function(err) {
                    return reject(err);
                });
            });
        }

        function updateReport(report) {
            return when.promise(function(resolve, reject) {
                report["hourly." + startDate.getHours()] = category.count;
                report.count.$inc(category.count);
                report.save().then(function(doc) {
                    return resolve({
                        category: category._id,
                        count: category.count,
                        licence_key: licence_key
                    });
                }).otherwise(function(err) {
                    return reject(err);
                });
            });
        }

        return findReport().then(updateReport);
    }

    for (var i = 0; i < categories.length; i++) {
        promises.push(when.resolve(pushHitsPerHourOfCategory(categories[i])));
    }

    return when.all(promises);

}

function aggregateChanges(licence_keys, day, startDate, endDate) {
    var promises = [];

    function aggregateChangesPerLicence(licence_key) {
        return when.promise(function(resolve, reject) {
            getApiHitsStatsPerLicenceKey(licence_key, startDate, endDate).then(function(categories) {
                return resolve(pushHitsPerHourOfItsCategory(licence_key, categories, day, startDate, endDate));
            }).otherwise(function(err) {
                return reject(err);
            });
        });
    }

    for (var i = 0; i < licence_keys.length; i++) {
        promises.push(when.resolve(aggregateChangesPerLicence(licence_keys[i])));
    }

    return when.all(promises);
}

function aggregate(day, startDate, endDate) {
    return when.promise(function(resolve, reject) {
        log.info("start aggregate for %s logs between %s and %s", moment(day).format("dddd, MMMM Do YYYY"), moment(startDate).format("hA"), moment(endDate).format("hA"));
        log.info("aggregate start at %s ", moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
        getApiHitsClientsWithin(startDate, endDate).then(function(licence_keys) {
            log.info("%s client hit servers between %s and %s", licence_keys.length, moment(startDate).format("ddd, hA"), moment(endDate).format("ddd, hA"));
            log.data("clientclientclient licence_keys: \n" + licence_keys);
            return resolve(aggregateChanges(licence_keys, day, startDate, endDate).then(function() {
                log.info("successfully end aggregate for %s logs between %s and %s", moment(day).format("dddd, MMMM Do YYYY"), moment(startDate).format("hA"), moment(endDate).format("hA"));
                log.info("aggregate end at %s ", moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
                return resolve();
            }).otherwise(function(err) {
                log.error("error occureed while aggregate for %s logs between %s and %s", moment(day).format("dddd, MMMM Do YYYY"), moment(startDate).format("hA"), moment(endDate).format("hA"));
                log.info("aggregate end at %s ", moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
                log.error("error %s", err);
                return reject(err);
            }));
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
    getReports: function() {
        return when.promise(function(resolve, reject) {
            $report.find({}, function(err, reports) {
                if (err) {
                    return reject(err);
                }
                return resolve(reports);
            });
        });
    },
    clearReports: function() {
        return when.promise(function(resolve, reject) {
            $report.remove({}, function(err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    },
    _insertReports: function(reports) {
        return when.promise(function(resolve, reject) {
            if (!(reports instanceof Array)) {
                reports = [reports];
            }
            $report.collection.insert(reports, function(err, docs) {
                if (err) {
                    return reject(err);
                }
                return resolve(docs.ops);
            });
        });
    }
};