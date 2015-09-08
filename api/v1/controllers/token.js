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
var MissedParams = require('../../errors').MissedParams;

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
  //  var agentPassword = bcrypt.hashSync(agent.password, 8);
    // se settings.js storage configuration part for more detail
  /*  if (settings.storage.storageModule == "fake") {
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
    });*/
    if(password == agent.password){
      console.log('passwords match');
        return agent;
    }
    else{

        return "users:password not match for agent " + email +":" + password;
    }

        }).otherwise(function(error){
          return reject(error);
        });

}
//endpoint for generating token
exports.generateToken = function(req,res,next){

    var data ={};
    var missingParams = [];
    data.user_pass = req.body.password; //username of password
    data.client_id =req.body.clientId;
    data.email = req.body.user_email || missingParams.push("email");;
    data.license_key =req.body.key || missingParams.push("license_key");
    var access_token,token;
    console.log(data);
    if (missingParams.length > 0) {
      return next(new MissedParams(req.path, missingParams));
    }

    if(data.email)
    {
      console.log('there is an email');
        authenticate(data.email,data.user_pass).then(function (agent) {
          if (agent) {
            var access_token = jwt2.sign(
              {id:agent._id,name:agent.name,email: email,last_login : now.format("HH:mm:ss")},secret,{expiresInMinutes:60*24*7});//token expires in 1 week
              }
              //return access_token;
              var token = new Token({
              value : access_token,
              userId :agent.id,
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

    if(data.license_key)
      {
        storage.getClient(data.license_key).then(function(client){
          access_token = jwt2.sign({id:client.id,last_login:now.format("HH:mm:ss")},secret,{expiresInMinutes:60*24*7});
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
