$(document).ready(function() {
// scrape new btn, create container for articles
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    initPage();

    function initPage() {
// empty article container, get request headines route
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
            .then(function(data) {

            if (data && data.length) {
                renderArticles(data);
            }
            else {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        var articlePanels = [];
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createCard(articles[i]));
        }
        articleContainer.append(articlePanels);
    }
    function createCard(article) {

        var card = $(
        [
        "<div class = 'card shadow mb-4'>",
        "<div class='card-header bg-light'>",
        "<h4>",
        article.headline,
        
        "</h4>",
        "</div>",
        "<div class='card-body bg-white text-dark'>",
        "<h5>",
        article.summary,
        "</h5>",
        //  "</br>",
        "<a href= >",
        article.link,
        
        "</a>",
       "</div>",
        "<div class ='card-text bg-white pb-2 pl-2'>",
        "<a class='btn btn-info text-white save'>",
        "Save Article",
        "</a>",
       
        "</div>",
        "</div>"
        ].join(""));

        card.data("_id", article._id);

        return card;

    }

    function renderEmpty() {
         var emptyAlert = $(
        [
        "<div class='alert alert-warning text-center'>",
        "<h5>No new articles currently available.</h5>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center text-dark'>",
        "<h5> What would you like to do?</h5>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Scrape New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
        ].join(""));
        articleContainer.append(emptyAlert);
    }

    function handleArticleSave () {

        var articleToSave = $(this).parents(".card").data();
        articleToSave.saved = true;

        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
        .then(function(data) {

            if (data.ok) {
                initPage();

            }
        });
    }

    function handleArticleScrape() {
        $.get("/api/fetch")
        .then(function(data) {
            initPage();
            bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
            // bootbox.alert({
            //     message: data.message,
            //     className: 'rubberBand animated'
            // });
        });
    }
});