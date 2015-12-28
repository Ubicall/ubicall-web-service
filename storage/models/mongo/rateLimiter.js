var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
//Model for any request exceeding rate limit
var ratelimiterSchema = new Schema({
    licence_key: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: false
    },
    url: {
        type: String,
        required: true
    },
    max_limit: {
        type: Number
    }
});

module.exports = mongoose.model("rateLimiter", ratelimiterSchema);