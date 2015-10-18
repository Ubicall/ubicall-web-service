var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');


// TODO store allowed domains to use our api ,
// TODO check if current request domain is in this list
// if true process to api , otherwise remove Access-Control-Allow-Origin header
// and to be more aggressive remove Access-Control-Allow-Methods and Access-Control-Allow-Headers too
// then response with HTTP_403 , Forbidden , you not in our allowed domain list


var corsOptions = {
  origin: [/^(.+\.)?ubicall.com$/],
  headers: ['X-Requested-With', 'Content-Type', 'Accept', 'Origin', 'Authorization', 'X-CSRFToken', 'User-Agent', 'Accept-Encoding'],
  credentials: true
};

function ubicallCors(req, res, next) {
  if (!res.getHeader('Access-Control-Allow-Origin')) { // this is allowed origin
    return res.status(403).json({
      message: 'Forbidden',
      hint: 'you don\'t allowed to call this api'
    });
  } else {
    req.isOriginAllowed = true;
    next();
  }
}



module.exports = {
  cors : ubicallCors,
  options : corsOptions
};
