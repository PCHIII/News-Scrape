// cheerio scrape script
// require request and cheerio to scrape nyt

var request = require("request");
var cheerio = require("cheerio");


var scrape = function (cb) {
    request("http://www.nytimes.com/section/politics", function(err, res, body) {

        var $ = cheerio.load(body);

        var articles = [];

        $("article").each(function(i, element) {
// grab story heading and summary and remove white space.
            var head = $(this).children("h2").text().trim();


            var sum = $(this).children("p").text().trim();
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