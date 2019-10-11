$(document).ready(function () {
    var articleContainer = $(".article-container");

    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    initPage();

    function initPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function (data) {
            if (data && data.length) {
                renderArticles(data);
            } else {
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
                "<div class = 'card  shadow mb-4'>",
                "<div class='card-header p-2 pt-3 pl-3 bg-light'>",
                "<h4>",
                article.headline,
                "</h4>",
                "</div>",
                "<div class='card-body bg-white text-dark'>",
                "<h5>",
                article.summary,
                "</h5>",
                
                `<a class='linkTag' href='${article.link}'>`,
                article.link,
                "</a>",
                "</div>",
                "<div class ='card-text bg-white pb-3 pl-3'>",
                "<a class='btn btn-light border mr-3 delete'>",
                "Delete Article</a>",
                "<a class='btn btn-light border notes'>Article Notes</a>",
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
                "<h4>No saved Articles Currently Available.</h4>",
                "</div>",
                "<div class='card'>",
                "<div class='card-header text-center text-danger'>",
                "<h3> Do you want to Browse Available Articles?</h3>",
                "</div>",
                "<div class='card-body text-center'>",

                "<h4><a href='/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"

            ].join(""));

        articleContainer.append(emptyAlert);
    }


    function handleArticleDelete() {
        var articleToDelete = $(this).parents(".card").data();
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function (data) {
            if (data.ok) {
                initPage();
            }
        });
    }


    function renderNotesList(data) {
        // function handles rendering note list items to notes modal, Setting up an array of notes to render after finished
        // Also setting up a currentNote variable to temporarily store each note
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            // If no notes, just display a message explaing
            currentNote = ["<li class='list-group-item'>", "No notes added for this article.", "</li>"].join("");
            notesToRender.push(currentNote);
        } else {
            // If have notes, go through each one
            for (var i = 0; i < data.notes.length; i++) {
                // Constructs an li element to contain noteText and a delete button
                currentNote = $(
                    [
                        "<li class='list-group-item note'>",
                        "<button class='btn btn-light border note-delete mr-3'>x</button>",
                        data.notes[i].noteText,
                        
                        "</li>"
                    ].join(""));
                // Store note id on the delete button for easy access when trying to delete
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        // append notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
    }


    function handleArticleNotes() {
        // function handles opending the notes modal and displaying notes
        // grab the id of the article to get notes for from the card element the delete button sits inside
        var currentArticle = $(this).parents(".card").data();
        // Grab any notes with this headline/article id
        $.get("/api/notes/" + currentArticle._id).then(function (data) {
            // Constructing initial HTML to add to the notes modal
            
            var modalText = [
                "<div class='card border-0 pt-3 pl-3'>",
                "<h5>Article #: ",
                currentArticle._id,
                "</h5>",
                "<hr />",
                "<ul class='list-group  mb-3 note-container'>",
                "</ul>",
                "<textarea placeholder='  Add New Note' rows='10' cols='60''></textarea>",
                "<button class='btn btn-light border  ml-auto mt-2 save'>Save Note</button>",
                "</div>"
            ].join("");

            // Adding the formatted HTML to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true,
                centerVertical: true,
                size: 'large',
                className: 'rubberBand animated'                             
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            // Adding  to the save button 
            $(".btn.save").data("article", noteData);
            renderNotesList(noteData);

        });
    }

    function handleNoteSave() {
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function () {
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data("_id");
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"

        }).then(function () {
            bootbox.hideAll();

        });
    }
});