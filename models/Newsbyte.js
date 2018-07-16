var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var newsbyteSchema = new Schema({
    artname: {
        type: String,
        required: true
    },
    blurp: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    wwwDoc: {
        type: String,
        required: true,
        unique: true
    },
    pic: {
        type: String
    },
    savedOn: {
        type: Date,
        default: null
    },
    remarks: {
        type: Schema.Types.ObjectId,
        ref: "remarks"
    }
});

var newsbyte = mongoose.model("newsbyte", newsbyteSchema);
module.exports = newsbyte;