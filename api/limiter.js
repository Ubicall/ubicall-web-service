var Limiter = require("ratelimiter");
var ms = require("ms");
var settings = require("../settings");
var log = require("../log");
var RateLimitExceededError = require("./errors").RateLimitExceededError;
var redis = require("redis"),
    db = redis.createClient({
        host: settings.cache.redis.internal_ip,
        port: settings.cache.redis.internal_port
    });

db.on("error", function(err) {
    log.error("Error limiter:redis" + err);
});

var MAX_LIMIT = 5000;
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
            log.warn("rate limit exceeded for " + req.user.access_token);
            return next(
                new RateLimitExceededError(
                    new Error("rate limit exceeded for " + req.user.access_token),
                    req.path,
                    "Rate limit exceeded, retry in " + ms(delta, {
                        long: true
                    })
                ));
        }
    });
}
module.exports = {
    rateLimiter: rateLimiter,
};