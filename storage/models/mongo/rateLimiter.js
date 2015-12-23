var mongoose = require("mongoose"), Schema = mongoose.Schema;
var rateLimiter   = new Schema({
  licence_key: { type: String, required: true },
  log:{ type: String, required: true },
  time: {type: Date, required: false },
});

module.exports = mongoose.model("rateLimiter", rateLimiter);