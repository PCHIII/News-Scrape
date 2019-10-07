
// server routes
// bring in scrap function from script directory

var scrape = require("../scripts/scrape");

// bring in headlines and notes from controller
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");


module.exports = function(router) {
    // route to render homepage
    router.get("/", function (req, res) {
        res.render("home");
    });
    // route to render the saved page
    router.get("/saved", function(req, res) {
        res.render("saved");
    });
// create and api route to fetch articles
    router.get("/api/fetch", function(req, res) {
        headlinesController.fetch(function(err, docs) {
            if (!docs || docs.insertedCount === 0) {
            res.json({
                message: "No new articles, please check back later!!"
                });
            }
            else {
            res.json({
                message: "Added " + docs.insertedCount + " new articles!"
            });
        }
    });
  });
//   grad the headlines in the database
router.get("/api/headlines", function(req, res) {
    var query = {};
    if (req.query.saved) {
        query = req.query;
    }
    headlinesController.get(query, function(data) {
        res.json(data);

    });
  });
// delete headlines
router.delete("/api/headlines/:id", function(req, res) {
    var query = {};
    query._id = req.params.id;
    headlinesController.delete(query, function(err, data) {
        res.json(data);
    });
   });
// patch to update the headlines
router.patch("/api/headlines", function(req, res) {
    headlinesController.update(req.body, function(err, data) {
        res.json(data);
    });
});

router.get("/api/notes/:headline_id", function(req, res) {
    var query = {};
    if (req.params.headline_id) {
        query._id = req.params.headline_id;
    }
    notesController.get(query, function(err, data) {
        res.json(data);
    });
   });

router.delete("/api/notes/:id", function(req, res) {
    var query = {};
    query._id = req.params.id;
    notesController.delete(query, function(err, data) {
        res.json(data);
    });
   });
//    post new notes to articles
router.post("/api/notes", function(req, res) {
    notesController.save(req.body, function(data) {
        res.json(data);
    });
   });
}