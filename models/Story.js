var mongoose = require("mongoose");

// Schema constructor
var Schema = mongoose.Schema;

var StorySchema = new Schema ({
    title: {
        type: String,
        required: true
    }
})