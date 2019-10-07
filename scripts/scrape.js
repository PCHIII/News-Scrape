// cheerio scrape script
// require request and cheerio to scrape nyt

var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
    request("http://www.nytimes.com", function(err, res, body) {

        var $ = cheerio.load(body);

        var articles = [];

        $(".theme-summary").each(function(i, element) {
// grab story heading and summary and remove white space.
            var head = $(this).children(".story-heading").text().trim();
            var sum = $(this).children(".summary").text().trim();
// replace regexp method line break and cleanup
            if (head && sum) {
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    headLine: headNeat,
                    summary: sumNeat
                };

                articles.push(dataToAdd);
            }
        });

// call back function to returning articles
        cb(articles);

    });
};
// export scrape to the app
module.exports = scrape;