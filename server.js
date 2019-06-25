var express = require("express");
var logger = require("morgan");

// to run mongodb
var mongoose = require("mongoose");

// web scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

var db = require ("./models/Story");

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
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

// GET route for scraping the website that I chooose
app.get("/scrape", function (req, res) {
    axios.get("https://mysitehere.com").then(function(response) {
        var $ = cheerio.load(response.data);
        // select what you want to scrape here
        $("article h2").each(function(i, element) {

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



// starting the server here
app.listen(PORT, function() {
    console.log("App running on port " + PORT + ".");
});
