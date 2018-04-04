const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
  res.render('register');
});

// Login
router.get('/login', function(req, res){
  res.render('login');
});

// Register User
router.post('/register', function(req, res){
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  var imageurl=req.body.imageurl;

  // Validation
  req.checkBody('firstname', 'First Name is required').notEmpty();
  req.checkBody('lastname', 'Last Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors:errors
    });
  } else {
    var newUser = new User({
      firstname: firstname,
      lastname: lastname,
      email:String(email).toLowerCase(),
      username: String(username).toLowerCase(),
      password: password,
      imageurl: imageurl
    });

    User.createUser(newUser, function(err, user){
      if(err){
        console.log(err);
        req.flash('error_msg', err.name);
        res.redirect('/users/register');
      }else{
        console.log(user);
      }
    });
    req.flash('success_msg', 'You are registered and can now login');
    res.redirect('/users/login');
  }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err){
        console.log(err);
        req.flash('error_msg', err.name);
        res.redirect('/users/login');
      }else{
        if(!user){
          return done(null, false, {message: 'Unknown User'});
        }
        User.comparePassword(password, user.password, function(err, isMatch){
          if(err){
            console.log(err);
            req.flash('error_msg', err.name);
            res.redirect('/users/login');
          }else{
            if(isMatch){
              return done(null, user);
            } else {
              return done(null, false, {message: 'Invalid password'});
            }
          }
        });
      }
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

  router.post('/login',passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),function(req, res){
    res.redirect('/');
  });

  router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

  module.exports = router;