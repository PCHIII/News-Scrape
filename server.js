// require dependencies

var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// set port to be 3000 or host port
var PORT = process.env.PORT || 3000;

// initiate express app
var app = express();

// set up Express Router
var router = express.Router();


// require routes
require("./config/routes")(router);


// designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

// connect handlebars to express app
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// setup body parser
app.use(bodyParser.urlencoded({
  extended: false
}));

// use router
app.use(router);

// if deployed use the deployed db, otherwise use the local mongodb

var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

 mongoose.connect(db, function(error) {
 
   if (error) {
    console.log(error);
 }
 
  else {
    console.log("mongoose connection is successful");
  }
 });

app.listen(PORT, function() {
  console.log("Listening on port:" + PORT);
});