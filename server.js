var express = require("express");
var exphbs  = require('express-handlebars');
var PORT = process.env.PORT || 3000;
var app = express();
const logger = require("morgan");
var db = require ("./models");

// use public directory 
app.use(express.static(__dirname + "/public"));

// use morgan 
app.use(logger("dev"));

// to run mongodb
const mongoose = require("mongoose");

// web scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// require html and api routes
require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes")(app);

// use express to parse JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());



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

var PORT = process.env.PORT || 3000;

// starting the server here
app.listen(PORT, function() {
    console.log("App running on port " + PORT + ".");
});
