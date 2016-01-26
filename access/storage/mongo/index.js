var when = require("when");
var mongoose = require("mongoose");
mongoose.Promise = require("when");
var logSchema = require("./models/log");
var limitExceededSchema = require("./models/limitExceeded");
var reportsSchema = require("./models/report");
var aggregate = require("./aggregate");
var log = require("../../../log");

var settings;
var $log, $limitExceeded, $report;

/**
 * @param request instance of ./models/ubicall_log/log
 **/
function logRequests(logs) {
    return when.promise(function(resolve, reject) {
        if (!(logs instanceof Array)) {
            logs = [logs];
        }
        $log.collection.insert(logs, function(err, docs) {
            if (err) {
                return reject(err);
            }
            return resolve(docs.ops);
        });
    });
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
            var conn;
            try {
                conn = mongoose.createConnection(uri, options);
            } catch (e) {
                return reject(e);
            }
            // why => http://stackoverflow.com/a/12807133
            $log = conn.model("log", logSchema, "log");
            $limitExceeded = conn.model("limit", limitExceededSchema, "limit");
            $report = conn.model("report", reportsSchema, "report");
            return resolve(aggregate.init(conn));
        });
    },
    /**
     * @param request instance of ./models/ubicall_log/log
     **/
    logRequests: logRequests,
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
    clearLogs: function() {
        return when.promise(function(resolve, reject) {
            $log.remove({}, function(err, done) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    },
    clearReports: aggregate.clearReports,
    getLogs: function() {
        return when.promise(function(resolve, reject) {
            $log.find({}, function(err, logs) {
                if (err) {
                    return reject(err);
                }
                return resolve(logs);
            });
        });
    },
    getReports: aggregate.getReports,
    aggregateLogs: aggregate.aggregateLogs,
    _insertReports: aggregate._insertReports
};