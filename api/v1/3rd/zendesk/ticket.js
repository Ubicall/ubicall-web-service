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
var Forbidden = require("../../utils/errors").Forbidden;


/**
	Create a zendesk ticket
* @param {Object} req.body - request body object, conatain valid [ticket fields](https://developer.zendesk.com/rest_api/docs/core/ticket_fields)
* @return HTTP status 200 if ticket created successfully
* @throws {@link ServerError} if failed to create a ticket
* @throws {@link Forbidden} if zendesk credentials not provided
* @example
* // https://developer.zendesk.com/rest_api/docs/core/ticket_fields#create-ticket-fields
* POST /3rd/zendesk/ticket
* @memberof API
*/

function createTicket(req, res, next) {
    if (req.user.zendesk && req.user.zendesk.email && req.user.zendesk.token && req.user.zendesk.domain) {
        var client = zendesk.createClient({
            username: req.user.zendesk.email,
            token: req.user.zendesk.token,
            remoteUri: "https://" + req.user.zendesk.domain + ".zendesk.com/api/v2"
        });
        client.tickets.create({
            "ticket": req.body
        }, function(err, req, result) {
            if (err) {
                return next(new ServerError(err, req.path, "error creating zendesk ticket"));
            }
            res.status(200).json(result);
        });
    } else {
        return next(new Forbidden({
            message: "must configure your zendesk account first"
        }, req.path));
    }
}



module.exports = {
    createTicket: createTicket
};