var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    findOneOrCreate = require("mongoose-find-one-or-create");
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
progressSchema.plugin(findOneOrCreate);
module.exports = progressSchema;