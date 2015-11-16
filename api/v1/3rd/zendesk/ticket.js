/**
 * Ticket main functionality
 * @version 0.0.1
 * @module api/v1/3rd/zendesk/ticket
 * @exports .
 * @namespace ticket
 */

var request = require("request");
var zendesk = require("node-zendesk");
var ServerError = require("../../utils/errors").ServerError;
var log = require("../../../../log");
var when = require("when");


/**
 *	Create a zendesk ticket
 * @param {Object} req.body - request body object, contain valid [ticket fields](https://developer.zendesk.com/rest_api/docs/core/ticket_fields)
 * @return HTTP status 200 if ticket created successfully
 * @throws {@link ServerError} if failed to create a ticket
 * @example
 * // https://developer.zendesk.com/rest_api/docs/core/ticket_fields#create-ticket-fields
 * POST /3rd/zendesk/ticket
 * @memberof API
 */

/*function createTicket(req, res, next) {
    var client = zendesk.createClient(req.user.zendesk);
    log.info("creating zendesk ticket for " + req.user.username + " as " + JSON.stringify(req.body));
    client.tickets.create({
        "ticket": req.body
    }, function(err, request, result) {
        if (err) {
            return next(new ServerError(err, req.path, "error creating zendesk ticket"));
        }
        res.status(200).json({
            message: "zendesk ticket submitted successfully"
        });
    });
}
*/
function createTicket(req, res) {
    return when.promise(function(resolve, reject) {
      var fields=req.body;    var custom_fields=[];
      for (var key in fields) {
        if(/^\d+$/.test(key)){
          console.log(key);
        custom_fields.push({"id": parseInt(key),"value":""});
      }
      }
        console.log(custom_fields);
        var options = {
            url: "https://ubicall.zendesk.com/api/v2/tickets.json",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
          auth: {
           user: "founders@ubicall.com/token",
           pass:"ZeFnzD7Dhu9hYt5TlUya8WCnaozbQF6MJLozokGj"
         },
            form:{
                "ticket":{
                  "subject":req.body.subject,
                  "description":req.body.description,
                  "custom_fields": [ { "id": 28897597, "value": "" } ]

                }
            }
        };
        
        request(options, function(error, response, body) {
          if (error || response.statusCode !== 200) {
                console.log(error);
              
                //   return reject(error || response.statusCode);
               } else {
                   log.verbose("success ");
                   return resolve(response.data);
               }
      
    });
});
}

module.exports = {
    createTicket: createTicket
};