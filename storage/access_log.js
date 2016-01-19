var when = require("when");
var mongoose = require("mongoose");
var settings = require("../settings");
var log = require("../log");
var logSchema = require("./models/ubicall_access/log");
var limitExceededSchema = require("./models/ubicall_access/limitExceeded");
var reportsSchema = require("../storage/models/ubicall_access/report");
var $log, $limitExceeded, $report;


function whatIsLastHourDate() {
    var last_hour = new Date();
    last_hour.setMinutes(0);
    last_hour.setSeconds(0);
    last_hour.setMilliseconds(0);
    return last_hour;
}

function whatIsToday() {
    var last_hour = whatIsLastHourDate();
    last_hour.setHours(0);
    return last_hour;
}

function getApiHitsClientsAtHour(hour) {
    return when.promise(function(resolve, reject) {
        $log.distinct("licence_key", {
            datetime: {
                "gte": hour
            }
        }, function(err, licence_keys) {
            if (err) {
                return reject(err);
            }
            return resolve(licence_keys || []);
        });
    });
}

function pushHitsPerHourOfCategory(licence_key, category, hits, day, hour) {
    $report.findOneAndUpdate({
        licence_key: licence_key,
        category: category,
        datetime: {
            $gte: day
        }
    }, {
        $inc: {
            hour: hits
        }
    });
}

function getApiHitsStatsPerLicenceKey(licence_key, hour) {
    return when.promise(function(resolve, reject) {
        $log.aggregate([{
            $match: {
                licence_key: licence_key,
                datetime: {
                    "$gte": hour
                }
            }
        }, {
            $group: {
                _id: "$category",
                count: {
                    $sum: 1
                }
            }
        }]).exec(function(err, res) {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });
}

function pushHitsPerHourOfItsCategory(licence_key, categories, today, hour) {
    var promises = [];

    for (var category in categories) {
        promises.push(pushHitsPerHourOfCategory(licence_key, category._id, category.count, today, hour));
    }

    return when.settle(promises);

}

module.exports = {
    init: function(_settings) {
        return when.promise(function(resolve, reject) {
            settings = _settings;
            var _host = settings.log.mongo.external_ip;
            var _port = settings.log.mongo.external_port;
            if (!process.env.db_env || process.env.db_env === "internal") {
                _host = settings.log.mongo.internal_ip;
                _port = settings.log.mongo.internal_port;
            }
            var uri = "mongodb://" + _host + ":" + _port + "/" + settings.log.mongo.database;
            var options = {
                db: {
                    native_parser: true
                },
                server: {
                    poolSize: 5
                },
                user: settings.log.mongo.username || "",
                pass: settings.log.mongo.password || ""
            };
            var conn = mongoose.createConnection(uri, options, function() {
                log.info("connected successfully to DB => %s:%s:%s", settings.log.mongo.database, _host, _port);
            });

            // why => http://stackoverflow.com/a/12807133
            $log = conn.model("log", logSchema, "log");
            $limitExceeded = conn.model("limit", limitExceededSchema, "limit");
            $report = conn.model("report", reportsSchema, "report");

            return resolve({});
        });
    },
    /**
     * @param request instance of ./models/ubicall_log/log
     **/
    log: function(request) {
        return when.promise(function(resolve, reject) {
            new $log(request).save();
            return when.resolve({}); // silently failing
        });
    },
    limitExceeded: function(licence_key, path, limit) {
        return when.promise(function(resolve, reject) {
            var __lex = new $limitExceeded({
                licence_key: licence_key,
                url: path,
                max_limit: limit
            });
            __lex.save(function(err, doc) {
                if (err || !doc) {
                    return reject(err || "no doc found !!");
                }
                return resolve(doc.toObject());
            });
        });
    },
    aggregateLogs: function() {
        return when.promise(function(resolve, reject) {
            var today = whatIsToday();
            var last_hour = whatIsLastHourDate();
            getApiHitsClientsAtHour(last_hour).then(function(licence_keys) {
                for (var i = 0; i < licence_keys.length; i++) {
                    getApiHitsStatsPerLicenceKey(licence_keys[i], last_hour)
                        .then(function(categories) {
                            return pushHitsPerHourOfItsCategory(licence_keys[i], categories, today, last_hour);
                        }).otherwise(function(err) {
                            log.info("error => %s", err);
                        });
                }
                return resolve({});
            }).otherwise(function(err) {
                return reject(err);
            });
        });
    }
};