var UbicallError = require('./errors').UbicallError;
var log = require('../log');

module.exports = {
  handle: function(err, req, res, next) {
    if (err instanceof UbicallError) {
      return res.status(err.status).json(err.response);
    } else {
      log.error("unexpected error type , which not instance of UbicallError");
      log.error("error : " + err);
      next();
    }
  }
}
