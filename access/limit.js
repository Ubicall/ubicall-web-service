var mongoose = require("mongoose");
var Limiter = require("ratelimiter");
var ms = require("ms");
var settings = require("../settings");
var log = require("../log");
var storage = require("../storage");
var RateLimitExceededError = require("./errors").RateLimitExceededError;
var ServerError = require("./errors").ServerError;

var redis = require("redis"),
    db = redis.createClient({
        host: settings.cache.redis.internal_ip,
        port: settings.cache.redis.internal_port
    });

db.on("error", function(err) {
    log.error("Error limiter:redis" + err);
});


// 5000 request per day
var MAX_LIMIT = 5000;
var LIMIT_PER = 24 * 60 * 60 * 1000; // 1 day

function rateLimiter(req, res, next) {
    if (true) {
        next();
    } else {
        var limit = new Limiter({
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
            } else if (process.env.node_env !== "production") {
                log.warn("quota limits ain't applied in " + process.env.node_env + " node");
                res.set("X-RateLimit-Disabled", process.env.node_env);
                return next();
            } else {
                var delta = (limit.reset * 1000) - Date.now() | 0;
                var after = limit.reset - (Date.now() / 1000) | 0;
                res.set("Retry-After", after);
                log.warn("rate limit exceeded for " + req.user.licence_key);
                storage.limitExceeded(req.user.licence_key, req.path, MAX_LIMIT);
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
}

function rateLimiterReset(req, res, next) {
    var limit = new Limiter({
        id: req.user.licence_key,
        db: db,
        max: MAX_LIMIT,
        duration: LIMIT_PER
    });
    limit.reset(function(err, limit) {
        if (err) {
            return next(new ServerError(err, req.path, "rateLimiterReset Error"));
        }
        res.set("X-RateLimit-Limit", limit.total);
        res.set("X-RateLimit-Remaining", limit.remaining - 1);
        res.set("X-RateLimit-Reset", limit.reset);

        return res.status(200).send({
            message: "Api Rate Limit Restored"
        });
    });
}


module.exports = {
    rateLimiter: rateLimiter,
    rateLimiterReset: rateLimiterReset
};