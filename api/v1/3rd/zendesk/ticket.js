/**
 * Ticket main functionality
 * @version 0.0.1
 * @module api/v1/3rd/zendesk/ticket
 * @exports .
 * @namespace ticket
 */

 var request = require("request");
 var zendesk = require("node-zendesk");
 var NotImplementedError = require("./utils/errors").NotImplementedError;
 var BadRequest = require("./utils/errors").BadRequest;
 var MissedParams = require("./utils/errors").MissedParams;
 var Forbidden = require("./utils/errors").Forbidden;
 var ServerError = require("./utils/errors").ServerError;
 var NotFound = require("./utils/errors").NotFound;

 function handleError(err) {
    console.log(err);
    process.exit(-1);
}

 function createTicket(req,res){
    var username = "founders@ubicall.com";
     var api_token = "ZeFnzD7Dhu9hYt5TlUya8WCnaozbQF6MJLozokGj";
     var domain ="ubicall";
     var subject=req.body.subject;
     var body=req.body.body;
     var type=req.body.type;
     var priority=req.body.priority;
     var client = zendesk.createClient({
         username:  username,
         token:api_token,
         remoteUri: "https://"+ domain +".zendesk.com/api/v2"
       });

       var ticket = {
                      "ticket":
                        {
                          "subject":subject,
                          "comment": { "body": body},
                          "type":type,
                          "priority": priority
                        }
                    };

        client.tickets.create(ticket,  function(err, req, result) {
          if (err){ return handleError(err);}
          console.log(JSON.stringify(result, null, 2, true));
          res.send(result);
        });
 }



 module.exports = {
   createTicket:createTicket
 };
