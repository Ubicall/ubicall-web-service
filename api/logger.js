var when = require("when");
var mongoose = require("mongoose");
var settings = require("../settings");
var log = require("../log");
var $log = require("../log/ubicall/mongo/models/log");
var logSchema = require("../log/ubicall/mongo/models/log");
var $log;


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
            $log = conn.model("apilogs", logSchema);
            return resolve({});
        });
    },
    log: function(req, res, next) {
        if (req.method !== "OPTIONS") { // skip options requests
            req.on("end", function() {
                req.user = req.user || {}; // in case, user is not authenticated yet
                var _log = {
                    url: req.path,
                    method: req.method,
                    params: req.params,
                    body: req.body,
                    query: req.query,
                    licence_key: req.user.licence_key,
                    app_id: req.user.appid,
                    user_agent: req.headers["user-agent"],
                    host: req.headers.host
                };

                if (res.statusCode !== 200) {
                    _log.status = "failure";
                    _log.status_code = res.statusCode;
                    _log.error = res.statusMessage;
                }

                new $log(_log).save();
            });
        }
        next();
    }
};