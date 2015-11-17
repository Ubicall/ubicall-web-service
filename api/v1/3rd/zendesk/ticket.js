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

function createTicket(req, res) {
    return when.promise(function(resolve, reject) {
      var fields=req.body;    var custom_fields=[];
      for (var key in fields) {
        if(/^\d+$/.test(key)){
        custom_fields.push({"id": parseInt(key),"value":fields[key]});
      }
      }
        var options = {
           url: req.user.zendesk.main+"/tickets.json",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            auth: {
               user: req.user.zendesk.username,
               pass: req.user.zendesk.token
            },
            json: true,
            body: {
                "ticket": {
                    "subject": req.body.Subject,
                    "description": req.body.Description,
                    "priority": req.body.Priority,
                    "status": req.body.Status,
                    "type": req.body.Type,
                    "group":req.body.Group,
                    "assignee":req.body.Assignee,
                    "custom_fields": custom_fields
                }
            }
        };
        request(options, function(error, response, body) {
            if (error) {
              return reject(error ||  response.statusCode);
            } else {
              return resolve(response.data);
            }
        });
});
}

module.exports = {
    createTicket: createTicket
};