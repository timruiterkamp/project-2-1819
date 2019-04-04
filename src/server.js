const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const wpToJson = require("./scripts/wpToJson.js");
const jsonToMd = require("./scripts/jsonToMd.js");
const dl = require("./scripts/downloadFiles.js");
const fs = require("fs");
const spdy = require("spdy");
// require("dotenv").config();
const app = express();

const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.crt")
};

app
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
  .use((req, res, next) => {
    res.setHeader("Cache-Control", "max-age=" + 365 * 24 * 60 * 60);
    next();
  })
  .use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect("https://" + req.headers.host + req.url);
    }
  })
  .use(bodyParser.json())
  .get("/offline", getOffline)
  .get("/", all);

const server = spdy.createServer(options, app);
server.listen(process.env.PORT || 3000);

function getOffline(req, res) {
  res.render("offline");
}

function all(req, res, next) {
  // wpToJson.createJsonPages();
  // wpToJson.createJsonPosts();
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

      // dl([
      //   content.header.image,
      //   content.design.image,
      //   content.studentwork.image,
      //   content["working-together"].image,
      //   content.masterclasses.image
      // ]);

      if (content) {
        res.render("overview", {
          header: {
            title: content.header.title,
            subtitle: content.header.subtitle,
            image: imageConcat(content.header.image, "medium"),
            lgImage: imageConcat(content.header.image, "large"),
            xlImage: imageConcat(content.header.image, "extralarge")
          },
          design: {
            title: content.design.title,
            content: content.design.content.replace(/<\/?[^>]+(>|$)/g, ""),
            btn_link: content.design.button_link,
            btn_text: content.design.button_text,
            image: imageConcat(content.design.image, "medium"),
            lgImage: imageConcat(content.design.image, "large"),
            xlImage: imageConcat(content.design.image, "extralarge")
          },
          studentwork: {
            title: content.studentwork.title,
            content: content.studentwork.content.replace(/<\/?[^>]+(>|$)/g, ""),
            btn_link: content.studentwork.button_link,
            btn_text: content.studentwork.button_text,
            image: imageConcat(content.studentwork.image, "medium"),
            lgImage: imageConcat(content.studentwork.image, "large"),
            xlImage: imageConcat(content.studentwork.image, "extralarge")
          },
          workingTogether: {
            title: content["working-together"].title,
            content: content["working-together"].content.replace(
              /<\/?[^>]+(>|$)/g,
              ""
            ),
            btn_link: content["working-together"].button_link,
            btn_text: content["working-together"].button_text,
            image: imageConcat(content["working-together"].image, "medium"),
            lgImage: imageConcat(content["working-together"].image, "large"),
            xlImage: imageConcat(
              content["working-together"].image,
              "extralarge"
            )
          },
          masterclasses: {
            title: content.masterclasses.title,
            content: content.masterclasses.content.replace(
              /<\/?[^>]+(>|$)/g,
              ""
            ),
            btn_link: content.masterclasses.button_link,
            btn_text: content.masterclasses.button_text,
            image: imageConcat(content.masterclasses.image, "medium"),
            lgImage: imageConcat(content.masterclasses.image, "large"),
            xlImage: imageConcat(content.masterclasses.image, "extralarge")
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
    wpToJson.createJsonPages();
  }
}

function imageConcat(image, size) {
  return `${image.substring(
    image.lastIndexOf("/") + 1,
    image.lastIndexOf(".")
  )}-${size}.webp`;
}
