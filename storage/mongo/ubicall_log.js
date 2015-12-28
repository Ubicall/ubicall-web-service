var when = require("when");
var Sequelize = require("sequelize");
var moment = require("moment");
var slug = require("slug");
var log = require("../../log");
var mongoose = require("mongoose");
var $rateLimter = require("../../storage/models/mongo/rateLimiter.js");
var settings;

function insertLog(licence_key, path, limit) {
    return when.promise(function(resolve, reject) {
        var now = new moment();
        var ratelimiter = new $rateLimter({
            licence_key: licence_key,
            time: now,
            url: path,
            max_limit: limit
        });
        ratelimiter.save(function(err) {
            if (err || !ratelimiter) {
                return reject(err || "no doc found!");
            }
            return resolve(ratelimiter.toObject());
        });
    });
}
module.exports = {
    init: function(_settings) {
        settings = _settings;
        var _host = settings.storage.ubicall_log.external_ip;
        var _port = settings.storage.ubicall_log.external_port;
        if (!process.env.db_env || process.env.db_env === "internal") {
            _host = settings.storage.mongo.ubicall_log.internal_ip;
            _port = settings.storage.mongo.ubicall_log.internal_port;
        }
        log.info("mongo db connection is : " + mongoose.connection.readyState === 0 ? " closed " : " open");
        if (mongoose.connection.readyState === 0) {
            var uri = "mongodb://" + _host + "/" + settings.storage.ubicall_log.database;
            var options = {
                db: {
                    native_parser: true
                },
                server: {
                    poolSize: 5
                },
                user: settings.storage.ubicall_log.username || "",
                pass: settings.storage.ubicall_log.password || ""
            };
            mongoose.connect(uri, options, function() {
                log.info("connected successfully to DB => " + settings.storage.ubicall_log.database + ":" + _host + ":" + _port);
            });
        }
    },
    insertLog: insertLog
};