require("dotenv").config(); //  .env
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public")); // adding public folder as a static resource
app.set("view engine", "ejs"); // setting view engine as ejs
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  // we tell our app to use the session package(which we required above) and then we set it up for initial configurations
  session({
    secret: "My little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize()); // we tell our app to use passport and initialize the passport package
app.use(passport.session()); //use passport for dealing with the session

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

//this schema is not a simple JS object. It's an object thats created from mongoose schema class
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose); // in order for userSchema we created to have a plugin, it has to be a mongoose schema

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    //login method comes from passportjs
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
