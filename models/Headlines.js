// scrape scripts and date scripts

var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// headline and note mongoose models
var Headline = require("../models/Headline");

module.exports = {
    fetch: function(cb) {
        scrape(function(data) {
            var articles = data;
            for (var i=0; i < articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }

            // mongo function to insert articles
            Headline.collection.insertMany(articles, {ordered:false}, function(err, docs){
                cb(err,docs);
            });

        });
    }
}