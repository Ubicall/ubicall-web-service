var UbicallError = require("./errors").UbicallError;
var log = require("../log");

module.exports = {
    handle: function(err, req, res, next) {
        if (err instanceof UbicallError) {
            return res.status(err.status || 500).json(err.response);
        } else {
            log.error("unexpected error type , which not instance of UbicallError");
            log.error("error : " + err);
            next();
        }
    },
    log: function(err, req, res, next) {
        log.error({
            error: err,
            path: req.path,
            host: req.headers.host,
            user_agent: req.headers["user-agent"]
        });
        next(err);
    }
};