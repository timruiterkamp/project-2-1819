const fetch = require("node-fetch");
const pageUrl = "http://localhost:8888/wp-json/wp/v2/pages";
const postUrl = "http://localhost:8888/wp-json/wp/v2/posts";
const fs = require("fs");

module.exports = {
  createJsonPages: function() {
    return fetch(pageUrl)
      .then(data => data.json())
      .then(res => {
        res.map(page =>
          fs.writeFile(
            `./src/json/pages/${page.slug}.json`,
            JSON.stringify(page),
            "utf8",
            err => {
              if (err) return console.log(err);
              console.log(`${page.slug} was saved`);
            }
          )
        );
      });
  },
  createJsonPosts: function() {
    return fetch(postUrl)
      .then(data => data.json())
      .then(res => {
        res.map(page =>
          fs.writeFile(
            `./src/json/posts/${page.slug}.json`,
            JSON.stringify(page),
            "utf8",
            err => {
              if (err) return console.log(err);
              console.log(`${page.slug} was saved`);
            }
          )
        );
      });
  }
};
