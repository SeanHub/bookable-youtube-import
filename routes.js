"use strict";

var bookableService = require("./services/bookableService"),
    youtubeService  = require("./services/youtubeService");

module.exports = function (app) {
  app.get("/", function (req, res) {
    var user = req.session.user;
    
    if (!user) {
      res.render("index", {});
    }
    else {
      res.redirect("/me");
    };
  });
  
  app.get("/me", function (req, res) {
    var user = req.session.user;
    
    if (!user) {
      res.redirect("/");
    }
    else {
      res.render("me", { user: user });
    };
  });
  
  app.post("/me/access", function (req, res) {
    bookableService.accessTokenTest(req.body.accessToken, function (err, user) {
      if (err) {
        res.render("index", { accessTokenError: err });
        
        res.redirect("/");
      }
      else {
        req.session.user = user;
        
        res.redirect("/me");
      };
    });
  });
  
  app.post("/import", function (req, res) {
    let playlistId = req.body.playlistId;
    
    youtubeService.getPlaylist(playlistId, function (err, list) {
      var youtubeUrl = "https://www.youtube.com/watch?v=";
      
      list.forEach(function (item) {
        let feedUrl = item.link[1].href,
            fragments = feedUrl.split("/"),
            videoId = fragments[fragments.length - 2],
            videoUrl = `${ youtubeUrl }${ videoId }`;
        
        bookableService.addBookmark(req.session.user.accessToken, videoUrl, ["yt-imported"], function (err, success) {
          if (err) {
            res.render("import", { imported: false });
          }
          else {
            res.render("import", { imported: true });
          }
        });
      });
    });
  });
};