// Load required packages
var Client = require('../models/client');

// Create endpoint /api/client for POST
exports.postClients = function(req, res) {
  // Create a new instance of the Client model
  var client = new Client();

  // Set the client properties that came from the POST data
  client.name = req.body.name;
  client.id = req.body.id;
  client.secret = req.body.secret;
  req.user = {
    "_id": "55e837407182ea9e26bef081",
    "username": "rawan2",
    "password": "$2a$05$IXYmmiwt4Ve3u0rpQNmGaOA3NHViCNNeGeMTCalqynvSt5JT8tQ/6"
};
  client.userId = req.user._id;

  // Save the client and check for errors
  client.save(function(err) {
    if (err){
      res.send(err);
    }
    else{
    res.json({ message: 'Client added to the locker!', data: client });}
  });
};

// Create endpoint /api/clients for GET
exports.getClients = function(req, res) {
  // Use the Client model to find all clients
  Client.find({ userId: req.user._id }, function(err, clients) {
    if (err)
      res.send(err);

    res.json(clients);
  });
};
