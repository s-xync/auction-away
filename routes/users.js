const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const request = require("request");

var User = require("../models/user");

// Register
router.get("/register", function(req, res) {
  res.render("register", { title: "Register | Auction Away" });
});

// Login
router.get("/login", function(req, res) {
  res.render("login", { title: "Login | Auction Away" });
});

// Register User
router.post("/register", function(req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody("firstname", "First Name is required").notEmpty();
  req.checkBody("lastname", "Last Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Password is required").notEmpty();
  req
    .checkBody("password2", "Passwords do not match")
    .equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      title: "Register | Auction Away",
      errors: errors
    });
  } else {
    var newUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: String(email).toLowerCase(),
      username: String(username).toLowerCase(),
      password: password
    });

    User.createUser(newUser, function(err, user) {
      if (err) {
        console.log(err);
        req.flash("error_msg", err.name);
        res.redirect("/users/register");
      } else {
        console.log(user);
      }
    });
    req.flash("success_msg", "You are registered and can now login");
    res.redirect("/users/login");
  }
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) {
        console.log(err);
        req.flash("error_msg", err.name);
        res.redirect("/users/login");
      } else {
        if (!user) {
          return done(null, false, { message: "Unknown User" });
        }
        User.comparePassword(password, user.password, function(err, isMatch) {
          if (err) {
            console.log(err);
            req.flash("error_msg", err.name);
            res.redirect("/users/login");
          } else {
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Invalid password" });
            }
          }
        });
      }
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/profile",
    failureRedirect: "/users/login",
    failureFlash: true
  }),
  function(req, res) {
    res.redirect("/users/profile");
  }
);

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

router.get("/profile", ensureAuthenticated, function(req, res) {
  var id = req.user._id;
  request.get(
    process.env.SERVER_API_URL + "/auctions/api/soldby/" + id,
    (err, response, body) => {
      if (!err) {
        var soldAuctions = JSON.parse(body);
        console.log(soldAuctions);
        request.get(
          process.env.SERVER_API_URL + "/auctions/api/boughtby/" + id,
          (err, response, body) => {
            if (!err) {
              var boughtAuctions = JSON.parse(body);
              res.render("profile", {
                title:
                  req.user.firstname +
                  " " +
                  req.user.lastname +
                  " | Auction Away",
                user: req.user,
                soldAuctions: soldAuctions,
                boughtAuctions: boughtAuctions
              });
            } else {
              console.log(err);
              req.flash("error_msg", "Something is wrong");
              res.redirect("/");
            }
          }
        );
      } else {
        console.log(err);
        console.log("here");
        req.flash("error_msg", "Something is wrong");
        res.redirect("/");
      }
    }
  );
});

router.post("/addmoney", ensureAuthenticated, (req, res) => {
  var userid = req.user._id;
  var amount = parseInt(req.body.amount);
  if (!isNaN(amount) && amount > 0) {
    User.findById(userid, function(err, user) {
      if (err) {
        console.log(err);
        req.flash("error_msg", err.name);
        res.redirect("/");
      }
      if (user) {
        user.balance = user.balance + amount;
        user.save(function(err) {
          if (err) {
            console.log(err);
            req.flash("error_msg", err.name);
            res.redirect("/");
          } else {
            req.flash("success_msg", "Money added");
            res.redirect("/users/profile");
          }
        });
      } else {
        req.flash("error_msg", "Unknown User");
        res.redirect("/users/login");
      }
    });
  } else {
    req.flash("error_msg", "Check the amount");
    res.redirect("/users/profile");
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error_msg", "You are not logged in");
    res.redirect("/users/login");
  }
}
module.exports = router;
