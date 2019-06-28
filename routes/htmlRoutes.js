var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render("index")
    });

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

}