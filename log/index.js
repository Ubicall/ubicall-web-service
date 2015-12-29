var when = require("when");
var winston = require("winston");
require("winston-mongodb").MongoDB;
var settings = require("../settings");

var logger = new(winston.Logger)({
    levels: {
        trace: 0,
        input: 1,
        verbose: 2,
        prompt: 3,
        debug: 4,
        info: 5,
        data: 6,
        help: 7,
        warn: 8,
        error: 9
    },
    colors: {
        trace: "magenta",
        input: "grey",
        verbose: "cyan",
        prompt: "grey",
        debug: "blue",
        info: "green",
        data: "grey",
        help: "cyan",
        warn: "yellow",
        error: "red"
    }
});


logger.add(winston.transports.Console, {
    level: process.env.node_env !== "production" ? "verbose" : "info",
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: true
});

logger.add(winston.transports.DailyRotateFile, {
    level: process.env.node_env !== "production" ? "verbose" : "info",
    prettyPrint: false,
    silent: false,
    colorize: false,
    timestamp: true,
    filename: "./.log/api.log",
    json: false
});


if (settings.log.enabled === true) {
    var _host = settings.log.mongo.external_ip;
    var _port = settings.log.mongo.external_port;
    if (!process.env.db_env || process.env.db_env === "internal") {
        _host = settings.log.mongo.internal_ip;
        _port = settings.log.mongo.internal_port;
    }

    var uri = "mongodb://" + _host + ":" + _port + "/" + settings.log.mongo.database;

    logger.add(winston.transports.MongoDB, {
        db: uri,
        collection: "logs",
        options: {
            db: {
                native_parser: true
            },
            server: {
                poolSize: 5
            }
        },
        username: settings.log.mongo.username || "",
        password: settings.log.mongo.password || ""
    });
}

module.exports = logger;