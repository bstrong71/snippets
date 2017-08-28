const express   = require("express");
const User      = require("../models/user");
const Snippet   = require("../models/snippet");
const router    = express.Router();
const mongoose  = require("mongoose");
const passport  = require("passport");

mongoose.connect("mongodb://localhost:27017/snippetData");


//** Middleware to require login on specific pages **//
const requireLogin = function (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect("/login");
  }
};
//** Middleware to verify if user is logged in **//
const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/user")
  } else {
    next();
  }
};

router.get("/", login, function(req, res) {
  res.render("signin")
});

router.get('/login', login, function(req, res) {
  res.render('signin', {
    messages: res.locals.getMessages()
  });
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signin");
});

router.post("/signup", function(req, res) {
  User.create({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  }).then(function(data) {
    res.redirect("/user");
  })
  .catch(function(err) {
    res.redirect("/");
  });
});

//** Allows logged-in user to view UserPage **//
router.get("/user", requireLogin, function(req, res) {
  Snippet.find({})
  .then(function(data) {
    res.render("theUserPage", {snippet: data})
  })
  .catch(function(err) {
    res.redirect('/');
  })
});

router.get("/snippet/:viewSnip", requireLogin, function(req, res) {
  if (req.params.viewSnip === 'main.css') {
    res.render("theSnippet", {data: req.session.data})
    req.session.data = null;
  }
  Snippet.find({_id: req.params.viewSnip})
  .then(function(singleSnippet) {
    req.session.data = singleSnippet;
    res.render("theSnippet", {data: singleSnippet})
  })
  .catch(function(err) {
    res.redirect("/");
  })
});

router.get("/language/:searchLang", requireLogin, function(req, res) {
  Snippet.find({language: req.params.searchLang})
  .then(function(data) {
    res.render("theUserPage", {snippet: data})
  })
  .catch(function(err) {
    res.redirect("/");
  })
});

router.get("/tags/:searchTags", requireLogin, function(req, res) {
  Snippet.find({tags: req.params.searchTags})
  .then(function(data) {
    res.render("theUserPage", {snippet: data})
  })
  .catch(function(err) {
    res.redirect("/");
  })
});

router.get("/create", requireLogin, function (req, res) {
  res.render("create")
});

//****fix this to grab new snippet data****//
router.post("/create", function(req, res) {
  Snippet.create({
    username: req.body.username,
    title: req.body.title,
    snippet: req.body.snippet,
    notes: req.body.notes,
    language: req.body.language,
    tags: req.body.tags
  })
  .then(function(data) {
    console.log("THIS IS /CREATE USERNAME .THEN");
    res.redirect("/user");
  })
  .catch(function(err) {
    console.log("THIS IS /CREATE .CATCH");
    console.log(err);
    res.redirect("/");
  });
});

//** Logout of user account **//
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
