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

/**
 * category => [regex], match a category by those regex
 **/
var CATS = {
    call: ["^/sip/call", "^/web/call", "^/call", "^/call/queue", "^/workinghours"],
    email: ["^/email"],
    agent: ["^/agent", "^/agent/image", "^/agent/calls", "^/agent/queues"],
    sip: ["^/sip/account", "^web/account"]
};

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

/**
 * map a request url to it's category
 * @param String url - url to be matched with a category
 * @return String category - matched @param url category, None if no catagory found
 **/
function findCat(url) {
    for (var key in CATS) {
        var rex = CATS[key];
        for (var i = 0; i < rex.length; i++) {
            var matched = url.match(rex[i]) || [];
            if (matched && matched.length > 0) {
                return key;
            }
        }
    }
    return "None";
}

function ubicallLogger(req, res, next) {
    if (req.method !== "OPTIONS") { // skip options requests
        req.on("end", function() {
            req.user = req.user || {}; // in case, user is not authenticated yet
            var _request = {
                url: req.path,
                method: req.method,
                params: req.params,
                body: req.body,
                query: req.query,
                licence_key: req.user.licence_key,
                app_id: req.user.appid,
                user_agent: req.headers["user-agent"],
                host: req.headers.host,
                category: findCat(req.path)
            };

            if (res.statusCode !== 200) {
                _request.status = "failure";
                _request.status_code = res.statusCode;
                _request.error = res.statusMessage;
            }

            storage.logRequest(_request);
        });
    }
    next();
}

module.exports = {
    rateLimiter: rateLimiter,
    rateLimiterReset: rateLimiterReset,
    ubicallLogger: ubicallLogger
};