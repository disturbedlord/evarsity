const express = require("express");
const scraper = require("./utils/scraper");
const app = express();
const bodyParser = require("body-parser");
var erpScraper;
var browser, page;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
console.log("starting...");

app.get("/", (req, res) => {
  erpScraper = new Promise((resolve, reject) => {
    scraper
      .scrapeData(1)
      .then(data => {
        browser = data.browser;
        page = data.page;
        console.log(this.browser);
        resolve(data);
      })
      .catch(err => {
        reject("Scrape Failed");
        console.log(err);
      });
  });
  console.log("runn");
  Promise.resolve(erpScraper)
    .then(data => {
      console.log(data.captcha.secure_url, data.pattern.secure_url);
      res.render("index", {
        captcha: data.captcha.url,
        pattern: data.pattern.url
      });
    })
    .catch(err => res.status(500).send(err));
});

app.post("/", function(req, res) {
  var reg_no = req.body.regno;
  var pass_word = req.body.password;
  var captcha_code = req.body.code;

  erpScraper = new Promise((resolve, reject) => {
    scraper.insertData(reg_no, pass_word, captcha_code, browser, page);
  });
});

app.listen(process.env.PORT || 3000);
