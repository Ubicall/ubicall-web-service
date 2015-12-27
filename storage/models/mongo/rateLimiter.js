var mongoose = require("mongoose"), Schema = mongoose.Schema;
var rateLimiter   = new Schema({
  licence_key: { type: String, required: true },
  time: {type: Date, required: false },
  url:{type:String,required:true},
  limit:{type:Number}
});

module.exports = mongoose.model("rateLimiter", rateLimiter);