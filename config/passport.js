const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const config = require("../config/database");
const bcrypt = require("bcryptjs");

module.exports = (passport) => {
  console.log("entered passport!");
  // Local Strategy
  passport.use(new LocalStrategy((username, password, done) => {

    // Match Username
    let query = {username:username};
    User.findOne(query, (err, user) => {
      if (err) throw err;
      if (!user) {
        console.log("user not found!");
        return done(null, false, {message: "No user found"});
      }
      console.log("user checks out");

      // Match Password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          console.log("user match!");
          return done(null, user);
        } else {
          console.log("user NO MATCH - WRONG PASSWORD!!!");
          return done(null, false, {message: "Wrong password"});
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
