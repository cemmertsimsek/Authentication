const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.use(express.static("public")); // adding public folder as a static resource
app.set("view engine", "ejs"); // setting view engine as ejs
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
