var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
var logSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    params: {
        type: Schema.Types.Mixed
    },
    body: {
        type: Schema.Types.Mixed
    },
    query: {
        type: Schema.Types.Mixed
    },
    licence_key: {
        type: String
    },
    category: {
        type: String,
        default: "none"
    },
    app_id: { // Client Id
        type: String
    },
    user_agent: {
        type: String
    },
    user_ip: {
        type: String
    },
    datetime: {
        type: Date,
        default: Date.now
    },
    status: { //success or failure
        type: String,
        default: "success"
    },
    status_code: {
        type: Number,
        default: 200
    },
    error: {
        type: String
    }
});
module.exports = logSchema;