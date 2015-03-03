"use strict";

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    config      = require("./config"),
    session     = require("express-session");

app.set('view engine', 'jade');


app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(__dirname + "/public"));

var routes = require("./routes")(app);

const PORT = process.env.PORT || 5000;

var server = app.listen(PORT, function () {
  let host = server.address().address;

  console.log('bookable-youtube-import listening @ http://%s:%s', host, PORT);
});