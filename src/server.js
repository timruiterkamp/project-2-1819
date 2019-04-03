const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const wpToJson = require("./scripts/wpToJson.js");
const jsonToMd = require("./scripts/jsonToMd.js");
const fs = require("fs");
// require("dotenv").config();

express()
  .engine(
    "handlebars",
    exphbs({
      defaultLayout: "main",
      partialsDir: __dirname + "/views/partials/"
    })
  )
  .set("view engine", "handlebars")
  .set("views", __dirname + "/views")
  .use(express.static(path.join(__dirname, "../public")))
  .use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader("Cache-Control", "max-age=" + 365 * 24 * 60 * 60);
    next();
  })
  .get("/offline", getOffline)
  .get("/", all)
  .listen(process.env.PORT || 3000);

function getOffline(req, res) {
  res.render("offline");
}

function all(req, res, next) {
  // wpToJson.createJsonPages();
  // wpToJson.createJsonPosts();
  // jsonToMd.readFiles(
  //   "./src/json/",
  //   function(filename, content) {
  //     // console.log(filename, content);
  //   },
  //   function(err) {
  //     throw err;
  //   }
  // );
  try {
    fs.readFile("./src/json/pages/homepage.json", "utf8", function read(
      err,
      data
    ) {
      if (err) {
        console.log(err);
        wpToJson.createJsonPages();
      }
      content = JSON.parse(data).acf;
      console.log(content.header);
      if (content) {
        res.render("overview", {
          header: content.header,
          design: content.design,
          studentwork: content.studentwork,
          workingTogether: content["working-together"],
          masterclasses: content.masterclasses
        });
      }
    });
  } catch (err) {
    console.log(err);
    wpToJson.createJsonPages();
  }
}
