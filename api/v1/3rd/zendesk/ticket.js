/**
 * Ticket main functionality
 * @version 0.0.1
 * @module api/v1/3rd/zendesk/ticket
 * @exports .
 * @namespace ticket
 */

 var request = require("request");
 var zendesk = require("node-zendesk");
 var ServerError = require("../utils/errors").ServerError;

/**
  Create a zendesk ticket
* @param {String} req.body.subject Subject of the ticket
* @param {String} req.body.body Subject of the ticket
* @param {String} req.body.priority Priority of the ticket {urgent, high, normal, or low}
* @param {String} req.body.type Type of the ticket {problem, incident, question, or task}
* @return HTTP status 200 if ticket created successfully
 * @throws {@link ServerError} if storage.markCallFail failed
* POST /ticket
* @memberof API
*/

 function createTicket(req,res,next){
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
          if (err){   return next(new ServerError(err, req.path));}
          console.log(JSON.stringify(result, null, 2, true));
          res.status(200).json(result);
        });
 }



 module.exports = {
   createTicket:createTicket
 };
