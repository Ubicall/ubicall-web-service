var http = require('http');
var https = require('https');
var express = require('express');
var fs = require("fs");
var storage = require('./storage');
var infra = require('./infra');
var settings = require('./settings');
var apiv1 = require('./api/v1');
var log = require('./log');

var server;
process.env.node_env = process.env.node_env || 'development';

storage.init(settings).then(function() {
  app = express();
  if (settings.https) {
    server = https.createServer(settings.https, function(req, res) {
      app(req, res);
    });
  } else {
    server = http.createServer(function(req, res) {
      app(req, res);
    });
  }

  var meta = function(req, res) {
    res.status(200).json({
      'apiv1': 'https://api.ubicall.com/v1/'
    })
  };

  app.get('/', meta);

  apiv1.init(settings, storage).then(function(apia) {

    app.use('/v1' , apia);

    app.use(function(err, req, res, next) {
      if (process.env.node_env != 'production') {
        res.status(500).send({
          app: "api",
          message: err.message || err,
          stack: err.stack
        });
        log.error(err.message || err);
        log.error(err.stack);
      } else {
        res.status(500).send({
          app: "api",
          message: 'something wrong :))'
        });
      }
    });
  }).then(function(){
    return infra.init(settings);
  }).otherwise(function(err) {
    log.error("Failed To start Api App" + err.stack);
    log.error("Failed to start server:");
    if (err.stack) {
      log.error(err.stack);
    } else {
      log.error(err);
    }
    process.exit(1);
  });

  server.on('error', function(err) {
    if (err.errno === "EADDRINUSE") {
      log.error('Unable to listen on ' + getListenPath());
      log.error('Error: port in use');
    } else {
      log.error('Uncaught Exception:');
      if (err.stack) {
        log.error(err.stack);
      } else {
        log.error(err);
      }
    }
    process.exit(1);
  });

  server.listen(settings.port || 4000, settings.host || '0.0.0.0', function() {
    // stop wasting your time searching for PID just type in shell : pkill cc
    process.title = 'ubi-api';
    log.info('Server running now on  ' + process.env.node_env + " Mode ");
    log.info('Server now running at ' + getListenPath());
  });
});

/**
* @78pynhllm;ko,ko,
*/
function getListenPath() {
  var listenPath = 'http' + (settings.https ? 's' : '') + '://' +
    (settings.host == '0.0.0.0' ? '127.0.0.1' : settings.host) +
    ':' + settings.port || 4000;
  return listenPath;
}


process.on('uncaughtException', function(err) {
  log.error('[Api] Uncaught Exception:');
  if (err.stack) {
    log.error(err.stack);
  } else {
    log.error(err);
  }
  process.exit(1);
});

process.on('unhandledRejection', function(err) {
  log.error('[Api] unhandled Rejection:');
  if (err.stack) {
    log.error(err.stack);
  } else {
    log.error(err);
  }
});

process.on('SIGINT', function() {
  log.error('[Api] IS DOWN NOW');
  process.exit();
});
