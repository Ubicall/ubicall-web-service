var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
var progressSchema = new Schema({
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        // [running - completed - failed]
        default: "running"
    }
});
module.exports = progressSchema;