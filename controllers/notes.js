var Note = require("../models/Note");

module.exports = {
    get: function (data, cb) {
        Note.find({
            _storyID: data.ID
        }, cb);
    },
    save: function (data, cb) {
        var newNote = {
            _storyID: data._id,
            noteText: data.noteText
        };

        Note.create(newNote, function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(doc);
                cb(doc);
            }
        });
    },
    delete: function (data, cb) {
        Note.remove({
            _id: data._id
        }, cb);
    }
};