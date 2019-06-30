const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema ({
    title: String,
    body: String,
    _storyID: {
        type: Schema.Types.ObjectId,
        ref: "Story"
    },
    noteText: String
});

const Note = mongoose.model("Note", NoteSchema);

// Export it
module.exports = Note;