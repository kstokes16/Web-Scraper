var db = require("../models");

module.exports = function (app) {

// POST route 
app.post("/stories/:id", function (req, res) {
// Create the new note 
db.Note.create(req.body)
.then(function(dbNote) {
    return db.Story.findOneAndUpdate({_id: req.params.id }, { note: dbNote._id}, { new: true});
})
.then(function(dbStory) {
    res.json(dbStory);
})
.catch(function(err) {
    res.json(err);
    });
});

}