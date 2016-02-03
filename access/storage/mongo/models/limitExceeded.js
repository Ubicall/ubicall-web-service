var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
var limitExceededSchema = new Schema({
    licence_key: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        default: Date.now
    },
    url: {
        type: String,
        required: true
    },
    max_limit: {
        type: Number
    }
});
module.exports = limitExceededSchema;