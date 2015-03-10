"use strict";

var bookableService = require("./services/bookableService"),
  youtubeService = require("./services/youtubeService");

module.exports = function (app) {
  app.get("/", function (req, res) {
    var user = req.session.user;

    if (!user) {
      res.render("index", {});
    } else {
      res.redirect("/me");
    };
  });

  app.get("/me", function (req, res) {
    var user = req.session.user;

    if (!user) {
      res.redirect("/");
    } else {
      res.render("me", {
        user: user
      });
    };
  });

  app.post("/me/access", function (req, res) {
    bookableService.accessTokenTest(req.body.accessToken, function (err, user) {
      if (err) {
        res.render("index", {
          accessTokenError: err
        });

        res.redirect("/");
      } else {
        req.session.user = user;

        res.redirect("/me");
      };
    });
  });

  var addVideos = function (accessToken, videos, callback) {
    var i = 0;
    var addVideo = function (video) {
      bookableService.addBookmark(accessToken, video, ["youtube import"], function (err, success) {
        if (success) {
          i++;
          if (videos[i]) {
            addVideo(videos[i]);
          } else {
            callback(null, 'Completed');
          };
        } else {
          //if err is 'cannot add duplicate url', continue with function
          console.log(err);
          callback('Failed: ' + err);
        };
      });
    };
    addVideo(videos[0]);
  };

  app.post("/import", function (req, res) {
    var playlistId = req.body.playlistId;

      youtubeService.getPlaylist(playlistId, function (err, list) {
        var youtubeUrl = "https://www.youtube.com/watch?v=",
          youtubeUrlCollection = [];

        list.forEach(function (item) {
          let feedUrl = item.link[1].href,
            fragments = feedUrl.split("/"),
            videoId = fragments[fragments.length - 2],
            videoUrl = youtubeUrl + videoId;
          youtubeUrlCollection.push(videoUrl);
        });

        addVideos(req.session.user.accessToken, youtubeUrlCollection, function (err, success) {
          res.render("import", {
            status: err || success
          });
        });
      });
  });
};