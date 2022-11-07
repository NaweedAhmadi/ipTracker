const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const config = require(__dirname + "/config.js");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var searchIP = "";

app.get("/", function(req, res) {

  // First API - With the help of this API we get the Public IP address
  const ipURL = "https://api.ipify.org?format=json"

  https.get(ipURL, function(response) {
    response.on("data", function(data) {
      const userIP = JSON.parse(data);
      const ipAddress = userIP.ip;

      var currentIP = "";

      if (searchIP == "") {
        currentIP = ipAddress;
      } else {
        currentIP = searchIP;
      }

      let api = config.api();

      // Second API - With the help of this API we get the location of the IP address
      const locationURL = "https://geo.ipify.org/api/v2/country,city?apiKey=" + api + "&ipAddress=" + currentIP;

      https.get(locationURL, function(response) {
        response.on("data", function(data) {
          const ipLocation = JSON.parse(data);
          const myIP = ipLocation.ip;
          const region = ipLocation.location.region;
          const country = ipLocation.location.country;
          const zip = ipLocation.location.postalCode;
          const timezone = ipLocation.location.timezone;
          const isp = ipLocation.isp;
          const lat = ipLocation.location.lat;
          const lng = ipLocation.location.lng;

          res.render("index", {
            ip: myIP,
            region: region,
            country: country,
            zip: zip,
            timezone: timezone,
            isp: isp,
            lat: lat,
            lng: lng
          })
        })
      })
    })
  })
})

app.post("/", function(req, res) {
  searchIP = req.body.searchIP;
  res.redirect("/");
})

app.listen(3000, function(req, res) {
  console.log("The server is running on port 3000.");
})
