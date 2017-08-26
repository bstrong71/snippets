const express   = require('express');
const User      = require('../models/user');
const router    = express.Router();
const mongoose  = require('mongoose');
const passport  = require('passport');

mongoose.connect('mongodb://localhost:27017/snippetData');

let data = []; //gives access to data in routes because global

//***Middleware to require login***//
const requireLogin = function (req, res, next) {
  if (req.user) {
    console.log(req.user)
    next()
  } else {
    res.redirect('/login');
  }
};
//***Middleware to verify that user is logged in***//
const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/")
  } else {
    next();
  }
};








module.exports = router;
