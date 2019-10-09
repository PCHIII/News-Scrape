$(document).ready(function() {
     var articleContainer = $(".article-container");

     $(document).on("click", ".btn.delete", handleArticleDelete);
     $(document).on("click", ".btn.notes", handleArticleNotes);
     $(document).on("click", ".btn.save", handleNoteSave);
     $(document).on("click", ".btn.note-delete", handleNoteDelete);

     initPage();

     function initPage() {
         articleContainer.empty();
         $.get("/api/headlines?saved=true").then(function(data) {
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
        "<div class = 'card  shadow mb-4'>",
        "<div class='card-header bg-light'>",
        "<h4>",
        article.headline,
        "</h4>",
        "</div>",
        "<div class='card-body bg-white text-dark'>",
        "<h5>",
        article.summary,
        "</h5>",
        "</br>",
        article.url,
        "</div>",
        "<div class ='card-text bg-white pb-2 pl-2'>",
        "<a class='btn btn-danger delete mr-2 text-white'>",
        "Delete Article</a>",
        "<a class='btn btn-info notes text-white'>Article Notes</a>",
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

    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = ["<li class='list-group-item'>",
                "No notes added for this article currently.", "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $(
                    [
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }

function handleArticleDelete() {
    var articleToDelete = $(this).parents(".card").data();
    $.ajax({
        method: "DELETE",
        url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
        if (data.ok) {
            initPage();
        }
    });
}

    function handleArticleNotes() {
        var currentArticle = $(this).parents(".card").data();
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            var modalText =  [
                "<div class='card border-0 pl-3'>",
                "<h5>Notes for Article: ",
                currentArticle._id,
                "</h5>",
                "<hr />",
                "<ul class='list-group  mb-3 note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='10' cols='60''></textarea>",
                "<button class='btn btn-success  ml-auto mt-2 save'>Save Note</button>",
                "</div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };

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
            $.post("/api/notes", noteData).then(function() {
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data("_id");
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
       
        }).then(function() {
            bootbox.hideAll();
        
        });
     }
    });