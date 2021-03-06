"use strict";

var request = require("request");

module.exports = {
  accessTokenTest: function (accessToken, callback) {
    if (!accessToken) { callback("no access token provided", null); }
    else {
      request({
        method: "GET",
        uri: "https://bookable.herokuapp.com/api/v1/me",
        headers: {
          "Authorization": accessToken
        }
      },
      function (err, response, body) {
        if (err) {
          callback("access token failed", null);
        }
        else {
          let jsonBody = JSON.parse(body),
              user = {
                accessToken: accessToken,
                firstName: jsonBody.forename
              };
          
          callback(null, user);
        };
      });
    };
  },
  addBookmark: function (accessToken, url, tags, callback) {
    let data = {
      url: url,
      tags: tags
    }
    
    request({
        method: "POST",
        uri: "https://bookable.herokuapp.com/api/v1/bookmarks",
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json"
        },
        json: data 
      },
      function (err, response, body) {
        if (!err && response.statusCode == 201) {
          callback(null, "success");
        }
        else {
          callback(response.body, null);
        };
      });
  }
};