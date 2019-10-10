// cheerio scrape script
// require request and cheerio to scrape nyt

var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");

var scrape = function (cb) {
  request("https://www.nytimes.com", function (err, res, body) {
    var $ = cheerio.load(res.body);
    var articles = [];

    $(".assetWrapper").each(function (i, element) {
      var head = $(this).find("h2").text().trim();
      var url = $(this).find("a").attr("href");
      var sum = $(this).find("p").text().trim();

      if (head && sum) {
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
          link: "https://www.nytimes.com" + url,


        };

        // console.log(dataToAdd)

        articles.push(dataToAdd);
      }
    });

    cb(articles);
    console.log(articles);
  });

};
// export scrape to the app
module.exports = scrape;