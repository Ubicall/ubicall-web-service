var when = require("when");
var mongoose = require("mongoose");
var settings = require("../settings");
var log = require("../log");
var logSchema = require("./models/ubicall_access/log");
var limitExceededSchema = require("./models/ubicall_access/limitExceeded");
var reportsSchema = require("../storage/models/ubicall_access/report");
var $log, $limitExceeded, $report;

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
    }
};