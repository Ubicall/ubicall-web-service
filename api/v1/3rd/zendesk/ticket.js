/**
 * Ticket main functionality
 * @version 0.0.1
 * @module api/v1/3rd/zendesk/ticket
 * @exports .
 * @namespace ticket
 */

var when = require("when");
var request = require("request");
var ServerError = require("../../utils/errors").ServerError;
var log = require("../../../../log");

/**
 * create zendesk ticket with request.js based on [gist](https://gist.github.com/waleedsamy/d074b459591de5155af8)
 */
function postZendeskTicket(zdcred, ticket) {
    return when.promise(function(resolve, reject) {
        if (Object.keys(ticket).length) {
            return reject("ticket contain nothing!");
        }
        var options = {
            url: zdcred.main + "/tickets.json",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            auth: {
                user: zdcred.username,
                pass: zdcred.token
            },
            json: true,
            body: ticket
        };
        request(options, function(error, response, body) {
            if (error) {
                return reject(error || response.statusCode);
            } else {
                return resolve(body);
            }
        });
    });
}

/**
 * Create a zendesk ticket
 * @param {Object} req.body - request body object, contain valid [ticket fields](https://developer.zendesk.com/rest_api/docs/core/ticket_fields)
 * @return HTTP status 200 if ticket created successfully
 * @throws {@link ServerError} if failed to create a ticket
 * @example
 * // https://developer.zendesk.com/rest_api/docs/core/ticket_fields#create-ticket-fields
 * POST /3rd/zendesk/ticket
 * @memberof API
 */

function createTicket(req, res, next) {
    var ticket = {
        custom_fields: []
    };

    for (var key in req.body) {
        if (/^\d+$/.test(key)) {
            ticket.custom_fields.push({
                "id": parseInt(key, 10),
                "value": req.body[key]
            });
        } else {
            ticket[key] = req.body[key];
        }
    }

    postZendeskTicket(req.user.zendesk, ticket).then(function(done) {
        res.status(200).json({
            message: "zendesk ticket submitted successfully"
        });
    }).otherwise(function(err) {
        return next(new ServerError(err, req.path, "error creating zendesk ticket"));
    });
}

module.exports = {
    createTicket: createTicket
};