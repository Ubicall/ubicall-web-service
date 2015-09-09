// Load required packages
var passport = require('passport');
//var BasicStrategy = require('passport-http').BasicStrategy;
var DigestStrategy = require('passport-http').DigestStrategy;
var LocalStrategy = require('passport-local').Strategy;
var Strategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var secret = 'xxx';
var jwt    = require('jsonwebtoken');

passport.use(new Strategy(
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

passport.use(new DigestStrategy(
  { algorithm: 'MD5', qop: 'auth' },
  function(username, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Success
      return callback(null, user, user.password);
    });
  },
  function(params, callback) {
    // validate nonces as necessary
    callback(null, true);
  }
));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass'
  },
  function(username, password, callback) {

    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }
      console.log('Authenticated user is',user);
      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({value: accessToken }, function (err, token) {
      if (err) { return callback(err); }
      if (!token) { return callback(null, false); }  // No token found
      jwt.verify(token.value, secret, function(err, decoded) {
            if (err) {
              console.log(err.name);
              if(err.name = 'JsonWebTokenError'){
                return callback(err,null);
              }
              if(err.name = 'TokenExpiredError'){
                //TODO call /auth/token api
              //  app.use('/auth/token');
              }
              return callback({ success: false, message: 'Failed to authenticate token.' });
            } else {
              // if everything is good, save to request for use in other routes
              console.log(decoded);
              status='valid';
              console.log('valid');
              return callback(null,decoded);
              next();
            }
          });

    /*  User.findOne({ _id: token.userId }, function (err, user) {
        if (err) { return callback(err); }
        console.log('returned user is',user);
        // No user found
        if (!user) { return callback(null, false); }

        // Simple example with no scope
        callback(null, user, { scope: '*' });
      });*/
    });
  }
));

passport.use('client-basic',new Strategy(
  function(username, password, callback) {
  console.log(username);
    Client.findOne({ id: username }, function (err, client) {
      console.log(client.secret);
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) {
        console.log('here'); return callback(null, false); }

      // Success
      return callback(null, client);
    });
  }));

exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isAuthenticated = passport.authenticate(['local', 'bearer'], { session : false });
//exports.isClientAuthenticated = passport.authenticate('basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });
