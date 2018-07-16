var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var remarksSchema = new Schema ({
    descr: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

var remarks = mongoose.model("remarks", remarksSchema);
module.exports = remarks;