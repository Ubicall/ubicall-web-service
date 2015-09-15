// Load required packages
var Token = require('../models/token');
var Client = require('../models/client'); //type of client ex: android,ios,web,...etc
var User = require('../models/user');
var storage = require('../../../storage');
var jwt2 = require('jsonwebtoken');
var moment = require('moment');
var now = new moment();
var bcrypt = require('bcrypt-nodejs');
var secret = 'xxx';
var ServerError = require('../utils/errors').ServerError;
var MissedParams = require('../utils/errors').MissedParam;
var Forbidden = require('../utils/errors').Forbidden;

// Create endpoint /api/token for POST
exports.postToken = function(req, res) {
  var token = new Token({
    value: req.body.token,
    userId: req.body.userId,
    clientId: req.body.clientId
  });

  token.save(function(err) {
    if (err)
      res.send(err);
    res.json({
      message: 'New token drinker added to the locker room!'
    });
  });
};

// Create endpoint /api/token for GET
exports.getTokens = function(req, res) {
  Token.find(function(err, tokens) {
    if (err)
      res.send(err);

    res.json(tokens);
  });
};

function authenticate(email, password) {
  return storage.getAgent(email).then(function(agent) {
    if (password == agent.password) {
      console.log('passwords match');
      return agent;
    } else {
      return "users:password not match for agent " + email + ":" + password;
    }

  }).otherwise(function(error) {
    return reject(error);
  });

}

//function for generating token
exports.authorize = function(req, res, next) {
  var data = {};
  data.user_pass = req.body.password; //user's of password
  data.client_id = req.body.clientId; //client Id
  data.client_secret = req.body.secret; //secret
  data.email = req.body.user_email;
  data.license_key = req.body.key;
  var access_token, token;
  var ccc = req.body.key || (req.body.email && req.body.password);
  if (!ccc) {
    return next(new Forbidden({
      message: "should provide username/password or license key"
    }, req.path));
  }
  if (data.email) {
    authenticate(data.email, data.user_pass).then(function(agent) {
      //check on client id and secret for returned agent
      Client.findOne({
        id: data.client_id
      }, function(err, client) {
        console.log('yes this client exists');
        if (err) {
          res.send(err);
        }
        // No client found with that id or bad password
        if (!client || client.secret !== data.client_secret) {
          console.log('here');
          return res.status(404).json({
            message: 'Unauthorized Client'
          });
        }
        if (client) {
          access_token = jwt2.sign({
            id: mongo_client.id,
            name: agent.name,
            email: agent.email,
            last_login: now.format("HH:mm:ss")
          }, secret, {
            expiresInMinutes: 60 * 24 * 7
          }); //token expires in 1 week
          token = new Token({
            value: access_token,
            userId: mongo_client.id,
            clientId: data.client_id
          });
          token.save(function(err) {
            if (err)
              res.send(err);
            return res.status(200).json({
              message: 'Token saved successfully',
              token: token
            });
          });
        } else {
          return res.status(500).json({
            message: 'Not a trusted client',
          });
        }
      });
    }).otherwise(function(err) {
      return next(new ServerError(err, req.path));
    });
  } else {
    if (data.license_key) {
      storage.getClient(data.license_key).then(function(client) { //mysql check
        Client.findOne({
          id: data.client_id
        }, function(err, mongo_client) {
          if (err) {
            return res.send(err)
          }
          // No client found with that id or bad password
          if (!mongo_client || mongo_client.secret !== data.client_secret) {
            return res.status(404).json({
              message: 'Unauthorized Client'
            });
          }
          if (mongo_client) {
            access_token = jwt2.sign({
              id: client.id,
              license_key:data.license_key,
              last_login: now.format("HH:mm:ss")
            }, secret, {
              expiresInMinutes: 60 * 24 * 7
            });
            token = new Token({
              value: access_token,
              userId: 'undefined',
              clientId: data.client_id
            });
            token.save(function(err) {
              if (err)
                res.send(err);
              return res.status(200).json({
                message: 'Token saved successfully',
                token: token
              });
            });
          } else {
            return res.status(500).json({
              message: 'Not a trusted client',
            });
          }
        });

      }).otherwise(function(error) {
        return next(new ServerError(error, req.path));
      });
    }
  }
}
