// cheerio scrape script
// require request and cheerio to scrape nyt

var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");

var scrape = function() {
    return axios.get("https://www.nytimes.com/").then(res => {
      var $ = cheerio.load(res.data);
      var articles = [];
  
      $(".assetWrapper").each(function(i, element) {
        var head = $(this)
          .find("h2")
          .text()
          .trim();
  
        var url = $(this)
        .find("a")
        .attr("href");
  
        var sum = $(this)
          .find("p")
          .text()
          .trim();
        
        // var img = $(this)
        //   .find("img")
        //   .attr("src");




// var scrape = function (cb) {
//     request("http://www.nytimes.com/", function(err, res, body) {

//         var $ = cheerio.load(body);

//         var articles = [];

//         $(".assetWrapper").each(function(i, element) {
// // grab story heading and summary and remove white space.
//             var head = $(this).children("h2").text().trim();


//             var sum = $(this).children("p").text().trim();
// replace regexp method line break and cleanup
            if (head && sum) {
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    headLine: headNeat,
                    summary: sumNeat,
                    url
                };
console.log(dataToAdd)
                articles.push(dataToAdd);
            }
        });

// call back function to returning articles
        // cb(articles);
        return articles;
    });
};
// export scrape to the app
module.exports = scrape;