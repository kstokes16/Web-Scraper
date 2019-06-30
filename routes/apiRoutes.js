var db = require("../models");

// POST route 
app.post("/stories/:id", function (req, res) {
// Create the new note 
db.Note.create(req.body)
.then(function(dbNote) {
    return db.Story.findOneandUpdate({_id: req.params.id }, { note: dbNote._id}, { new: true});
})
.then(function(dbStory) {
    res.json(dbStory);
})
.catch(function(err) {
    res.json(err);
    });
});