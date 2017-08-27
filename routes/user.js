const express   = require("express");
const User      = require("../models/user");
const router    = express.Router();
const mongoose  = require("mongoose");
const passport  = require("passport");

mongoose.connect("mongodb://localhost:27017/snippetData");

let data = []; //gives access to data in routes because global

//requires login to access user profile page//
const requireLogin = function (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login');
  }
};

const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/")
  } else {
    next();
  }
};

//***require login at directory page***//
router.get('/', requireLogin, function(req, res) {
  User.find({}).sort("name")
    .then(function(users) {
      let loggedIn = req.user;
      data = users;
      res.render('public', {users: data, loggedIn: loggedIn});
    })
    .catch(function(err) {
      console.log(err);
    })
});

router.get('/login', login, function(req, res) {
  res.render('login', {
    messages: res.locals.getMessages()
  });
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res) {
  User.create({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  }).then(function(data) {
    res.redirect("/");
  })
  .catch(function(err) {
    console.log(err);
    res.redirect("/signup");
  });
});


//***View User Profile Page***//
router.get('/user/:id', function (req, res) {
  let id = req.params.id;
  if(req.user.id === id) {
    let userP = data.find(function(user) {
      return user.id == id;
    });
    res.render('privateprofile', {userP: userP});
  } else {
    let userP = data.find(function(user) {
      return user.id == id;
    });
    res.render('profile', userP);
  }
});

router.post('/update/:id', function(req, res) {
  let id = req.params.id;
  let profileUpdate = {};
  if(req.body.name){
    profileUpdate.name = req.body.name;
  };
  if(req.body.email){
    profileUpdate.email = req.body.email;
  };

  User.update({_id: id}, {$set: profileUpdate})
    .then(function(data) {
    res.redirect("/");
    })
    .catch(function(err) {
      console.log(err);
  })
})

router.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    console.log(err);
  });
  res.redirect("/");
});

module.exports = router;
