var UbicallError = require('../errors').UbicallError;

module.exports = {
  handle: function(err, req, res, next) {
    if (err instanceof UbicallError) {
      return res.status(err.status).json(err.response);
    }
  }
}
