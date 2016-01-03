var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
var limitExceededSchema = new Schema({
    licence_key: {
        type: String,
        required: true
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