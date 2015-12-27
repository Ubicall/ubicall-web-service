var Limiter = require("ratelimiter");
var ms = require("ms");
var settings = require("../settings");
var log = require("../log");
var mongoose = require("mongoose");
var $limter = require("../storage/models/mongo/rateLimiter");
var $log = require("../storage/models/mongo/log");
var RateLimitExceededError = require("./errors").RateLimitExceededError;
var moment = require("moment");
var now = new moment();

var redis = require("redis"),
    db = redis.createClient({
        host: settings.cache.redis.internal_ip,
        port: settings.cache.redis.internal_port
    });

db.on("error", function(err) {
    log.error("Error limiter:redis" + err);
});
var uri = "mongodb://127.0.0.1:27017/ubicall_log";
var options = {
    db: {
        native_parser: true
    },
    server: {
        poolSize: 5
    },
    replset: {
        rs_name: "myReplicaSetName"
    },
    user: "",
    pass: ""
};
mongoose.connect(uri, options, function() {
    log.info("connected successfully to DB => ");
});
var MAX_LIMIT = 5;
var LIMIT_PER = 24 * 60 * 60 * 1000; // 1 day
var limit, id;

function rateLimiter(req, res, next) {

    limit = new Limiter({
        id: req.user.licence_key,
        db: db,
        max: MAX_LIMIT,
        duration: LIMIT_PER
    });
    limit.get(function(err, limit) {
        if (err) {
            return next(err);
        }
        res.set("X-RateLimit-Limit", limit.total);
        res.set("X-RateLimit-Remaining", limit.remaining - 1);
        res.set("X-RateLimit-Reset", limit.reset);

        if (limit.remaining) {
            return next();
        } else {
            var delta = (limit.reset * 1000) - Date.now() | 0;
            var after = limit.reset - (Date.now() / 1000) | 0;
            res.set("Retry-After", after);
            log.warn("rate limit exceeded for " + req.user.licence_key);
            return next(
                new RateLimitExceededError(
                    new Error("rate limit exceeded for " + req.user.licence_key),
                    req.path,
                    "Rate limit exceeded, retry in " + ms(delta, {
                        long: true
                    })
                ));
        }
    });
}


function rateLimiterReset(req, res, next) {
    log.info("Reset Limit");

    limit = new Limiter({
        id: req.user.licence_key,
        db: db,
        max: MAX_LIMIT,
        duration: LIMIT_PER
    });
    limit.reset(function(err, limit) {
        if (err) {
            return next(err);
        }
        res.set("X-RateLimit-Limit", limit.total);
        res.set("X-RateLimit-Remaining", limit.remaining - 1);
        res.set("X-RateLimit-Reset", limit.reset);

        return res.status(200).send();
    });
}

module.exports = {
    rateLimiter: rateLimiter,
    rateLimiterReset: rateLimiterReset
};