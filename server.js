const express = require("express");
const logger = require("morgan");

// to run mongodb
const mongoose = require("mongoose");

// web scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

const db = require ("./models");

var PORT = 3000;

// start up express
var app = express();

// use morgan 
app.use(logger("dev"));

// use express to parse JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// set public folder as the default
app.use(express.static("public"));

// connect to Mongo DB
mongoose.connect('mongodb://localhost/ArticleSaver', {useNewUrlParser: true});

// Routes are below

// GET route for scraping the website that I chooose
app.get("/scrape", function (req, res) {
    axios.get("https://www.alligator.org/").then(function(response) {
        var $ = cheerio.load(response.data);
        // select what you want to scrape here

        $(".card-headline h3").each(function(i, element) {

            // set emply result variable for what i am scraping
            let result = {};

            // add the elements of whatever you are looking to scrape
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            db.Story.create(result)
            .then(function(dbStory) {
                console.log(dbStory);
            })
            .catch(function(err) {
                console.log(err);
            });
        });

        // send scrape complete message
        res.send("Your scrape is done");
    });
});

// need to add all GET and POST routes below
app.get("/stories", function (req, res) {
    // Grab every story
    db.Story.find({})
      .then(function(dbStory) {
        // Send back successful stories
        res.json(dbStory);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

app.get("/stories/:id", function (req, res) {
    db.Story.findOne({ _id: req.params.id})
    .populate("note")
    .then(function(dbStory) {
        res.json(dbStory);
    })
    .catch(function(err) {
        res.json(err);
    });
});

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
