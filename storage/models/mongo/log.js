var mongoose = require("mongoose"), Schema = mongoose.Schema;
//Model for any request---details about the request
var logSchema   = new Schema({
  user_id:String,
  meta_data:Schema.Types.Mixed
});

module.exports = mongoose.model("log", logSchema);