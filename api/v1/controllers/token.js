// Load required packages
var Token = require('../models/token');
var User = require('../models/user');
var storage = require('../../../storage');
var jwt2 = require('jsonwebtoken');
var moment= require('moment');
var now = new moment();
var bcrypt = require('bcrypt-nodejs');
var secret = 'xxx';
var ServerError = require('../../errors').ServerError;

// Create endpoint /api/token for POST
exports.postToken = function(req, res) {
  var token = new Token({
  value : req.body.token,
  userId :req.body.userId,
  clientId :req.body.clientId
  });

  token.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'New token drinker added to the locker room!' });
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
  return storage.getAgent(email).then(function (agent) {

    var agentPassword = bcrypt.hashSync(agent.password, 8);
    // se settings.js storage configuration part for more detail
    if (settings.storage.storageModule == "fake") {
        password = email.split("@")[0];
    }
    bcrypt.compare(password, agentPassword, function (err, res) {
        if (err) {
            return reject(err);
        } else if(res) {
            return resolve(agent);
        }else {
          return reject("users:password not match for agent " + email +":" + password);
        }
    });
        }).otherwise(function(error){
          return reject(error);
        });

}
//endpoint for generating token
exports.generateToken = function(req,res,next){
    var user_pass = req.body.password; //username of password
    var client_id =req.body.clientId;
    var email = req.body.email;
    var license_key =req.body.key;
    var access_token,token;
    if(email)
    {
        authenticate(email, user_pass).then(function (user) {
          if (user) {
            var access_token = jwt2.sign(
              {id:user._id,name:user.name,email: req.body.email,last_login : now.format("HH:mm:ss")},secret,{expiresInMinutes:60*24*7});//token expires in 1 week
              }
              //return access_token;
              var token = new Token({
              value : access_token,
              userId :user._id,
              clientId :client_id
              });
                  //save the AT
            token.save(function(err) {
                if (err)
                  res.send(err);

                res.json({ message: 'New Token added to the locker room!' });
              });
                }).otherwise(function (error) {
                    res.json({message: 'auth:Incorrect username or password'});
                });
    }
    else{
      if(license_key)
      {
        console.log('there is a license key');
        storage.getClient(license_key).then(function(client){
          access_token = jwt2.sign({id:client.id,last_login:now.format("HH:mm:ss")},secret,{expiresInMinutes:60*24*7});
          console.log('this is client id',client.id);
          token = new Token({
          value : access_token,
          userId :'undefined',
          clientId :client.id
          });
          //save the AT
          token.save(function(err) {
              if (err)
                res.send(err);
                return res.status(200).json({
                  message: 'Token saved successfully',
                  token:token
                });
            });

    }).otherwise(function(error){
          return next(new ServerError(error,req.path));
        });
      }
     }

  }
