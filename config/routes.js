module.exports = function(router) {
    // route to render homepage
    router.get("/", function (req, res) {
        res.render("home");
    });
    // route to render the saved page
    router.get("/saved", function(req, res) {
        res.render("saved");
    });
}