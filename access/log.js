var storage = require("./storage");

// for more details check https://www.w3.org/Protocols/HTTP/HTRESP.html
var SUCCESS_RESPONSE_CODES = [200, 201, 202, 204, 304];

/**
 * category => [regex], match a category by those regex
 **/
var CATS = {
    call: ["^/sip/call", "^/web/call", "^/call", "^/call/queue",
        "^/workinghours", "^/sip/account", "^/web/account"
    ],
    email: ["^/email"],
    ivr: ["^/ivr"],
    agent: ["^/agent", "^/agent/image", "^/agent/calls", "^/agent/queues"],
    integration: ["^/3rd/zendesk"]
};

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
    return "none";
}

function logRequest(req, res, next) {
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
                category: findCat(req.path),
                status_code: res.statusCode,
                datetime: new Date()
            };

            // req fail if req status Code not found in accepted SUCCESS_RESPONSE_CODES
            if (SUCCESS_RESPONSE_CODES.indexOf(res.statusCode) === -1) {
                _request.status = "failure";
                _request.error = res.statusMessage;
            }

            storage.logRequest(_request);
        });
    }
    next();
}


module.exports = {
    logRequest: logRequest
};