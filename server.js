var express = require("express");
var exphbs  = require('express-handlebars');
var PORT = process.env.PORT || 3000;
var app = express();
app.use(express.static(__dirname + "/public"));
const logger = require("morgan");
var db = require ("./models");
// use morgan 
app.use(logger("dev"));

// to run mongodb
const mongoose = require("mongoose");

// web scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// use express to parse JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// set public folder as the default

// Link to database, depending on if deployed or running locally
var mongoDB = process.env.MONGODB_URI || "mongodb://localhost/ArticleSaver";

// connect to Mongo DB
mongoose.connect(mongoDB, function (error) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Mongo connection successful.");
    }
});

// Routes are below
require("./routes/htmlRoutes")(app);

// GET route for scraping the website that I chooose

// need to add all GET and POST routes below

app.post("stories/:id", function (req, res) {
    db.Note.create(req.body)
    .then(function (dbNote) {
        return db.Story.findOneAndUpdate({ _id: req.params.id}, { note: dbNote._id }, {new: true});
    })
    // Send the requested story back to the client
    .then(function(dbStory) {
        res.json(dbStory);
    })
    // If a story wasn't found, send an error to the client
    .catch(function (err) {
        res.json(err);
    });
});

// starting the server here
app.listen(PORT, function() {
    console.log("App running on port " + PORT + ".");
});
