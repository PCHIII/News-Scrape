
// create a new note document
var scrape = require("../scripts/scrape");
var Note = require("../models/Note");
var makeDate = require("../scripts/date");

var Headline = require("../models/Headline");
var Note = require("../models/Note")

module.exports = {
    delete: function(query, cb) {
      Note.remove(query, cb);
    },
    get: function(query, cb) {
      
      Note.find({headlineId: query._id})
  
        // Execute query
        .exec(function(err, doc) {
          // Once finished, pass the list into the callback function
          cb(err, doc);
          //console.log("query", query, "doc: ", doc, "err: ", err);
        });
       
    },
    save: function(query, cb) {
  
      Note.collection.save({headlineId: query._id, date: makeDate(), noteText: query.noteText}, function(err, docs) {
          cb(err, docs);
      });
    }
  };




// module.exports = {
//     get:function(data, cb) {
//         Note.find({
//             _headlineId: data._id
//         }, cb);
//     },
//     save:function(data, cb) {
//         var newNote = {
//             _headlineId: data._id,
//             date: makeData(),
//             noteText: data.noteText
//         };

//         Note.create(newNote, function (err, doc) {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 console.log(doc);
//                 cb(doc);
//             }
//         });
//     },
//     delete: function (data, cb) {
//         Note.remove({
//             _id: data._id
//         }, cb);

//     }
// };