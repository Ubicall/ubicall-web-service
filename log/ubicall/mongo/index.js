var when = require("when");
var moment = require("moment");
var mongoose = require("mongoose");
var limitExceededSchema = require("./models/limitExceeded.js");
var log = require("../../index.js");
var settings, $limitExceeded;

function limitExceeded(licence_key, path, limit) {
    return when.promise(function(resolve, reject) {
        var __lex = new $limitExceeded({
            licence_key: licence_key,
            url: path,
            max_limit: limit
        });
        __lex.save(function(err, doc) {
            if (err || !doc) {
                return reject(err || "no doc found!");
            }
            return resolve(doc.toObject());
        });
    });
}
module.exports = {
    init: function(_settings) {
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
        $limitExceeded = conn.model("limitExceeded", limitExceededSchema);

    },
    limitExceeded: limitExceeded
};