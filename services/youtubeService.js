"use strict";

var request = require("request");

module.exports = {
  getPlaylist: function (id, callback) {
    let dataUrl = 'https://gdata.youtube.com/feeds/api/playlists/' + id + '?v=2&alt=json&max-results=50';
    
    request({
      method: "GET",
      uri: dataUrl
    },
    function (err, response, body) {
      if (err) {
        callback("couldn't get playlist", null);
      }
      else {
        let jsonBody = JSON.parse(body);

        callback(null, jsonBody.feed.entry);
      };
    });
  }
};