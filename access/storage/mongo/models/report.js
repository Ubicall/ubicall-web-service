var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    findOneOrCreate = require("mongoose-find-one-or-create");
var reportSchema = new Schema({
    licence_key: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true
    },
    hourly: {
        "0": {
            type: Number,
            default: 0
        },
        "1": {
            type: Number,
            default: 0
        },
        "2": {
            type: Number,
            default: 0
        },
        "3": {
            type: Number,
            default: 0
        },
        "4": {
            type: Number,
            default: 0
        },
        "5": {
            type: Number,
            default: 0
        },
        "6": {
            type: Number,
            default: 0
        },
        "7": {
            type: Number,
            default: 0
        },
        "8": {
            type: Number,
            default: 0
        },
        "9": {
            type: Number,
            default: 0
        },
        "10": {
            type: Number,
            default: 0
        },
        "11": {
            type: Number,
            default: 0
        },
        "12": {
            type: Number,
            default: 0
        },
        "13": {
            type: Number,
            default: 0
        },
        "14": {
            type: Number,
            default: 0
        },
        "15": {
            type: Number,
            default: 0
        },
        "16": {
            type: Number,
            default: 0
        },
        "17": {
            type: Number,
            default: 0
        },
        "18": {
            type: Number,
            default: 0
        },
        "19": {
            type: Number,
            default: 0
        },
        "20": {
            type: Number,
            default: 0
        },
        "21": {
            type: Number,
            default: 0
        },
        "22": {
            type: Number,
            default: 0
        },
        "23": {
            type: Number,
            default: 0
        },
    },
    count: {
        type: Number,
        default: 0
    }
});
reportSchema.plugin(findOneOrCreate);
module.exports = reportSchema;