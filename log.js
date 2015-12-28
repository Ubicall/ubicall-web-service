var winston = require("winston");
var settings = require("./settings");
require("winston-mongodb").MongoDB;

var logger = new (winston.Logger)({
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



var _host = settings.storage.ubicall_log.external_ip;
var _port = settings.storage.ubicall_log.external_port;

if (!process.env.db_env || process.env.db_env === "internal") {
    _host = settings.storage.mongo.ubicall_log.internal_ip;
    _port = settings.storage.mongo.ubicall_log.internal_port;
}

logger.add(winston.transports.MongoDB, {
  db:"mongodb://" + _host + "/" + settings.storage.ubicall_log.database,
  collection: "logs"
});


module.exports = logger;
