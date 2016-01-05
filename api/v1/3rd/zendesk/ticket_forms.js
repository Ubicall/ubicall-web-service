/**
 * Ticket main functionality
 * @version 0.0.1
 * @module api/v1/3rd/zendesk/ticket
 * @exports .
 * @namespace ticket
 */

var when = require("when");
var request = require("request");
var ServerError = require("../../../errors").ServerError;
var log = require("../../../../log");

/**
 * curl https://{subdomain}.zendesk.com/api/v2/ticket_forms/{id}.json   -v -u {email_address}/token:{token}
 **/
function _getTicketForms(zd_cred) {
    return when.promise(function(resolve, reject) {
        var options = {
            url: zd_cred.main + "/ticket_forms.json",
            method: "GET",
            auth: {
                username: zd_cred.username,
                password: zd_cred.token
            }
        };
        request(options, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                log.warn(zd_cred.username + " does not have zendesk enterprise support");
                return resolve([]);
            } else {
                var zdfrm = JSON.parse(body);
                return resolve(zdfrm.ticket_forms);
            }
        });
    });
}

/**
 * Get a zendesk ticket Forms by call https://developer.zendesk.com/rest_api/docs/core/ticket_forms#list-ticket-forms
 * @return HTTP status 200 if ticket forms fetched successfully
 * @example
 * GET /3rd/zendesk/ticket/forms
 * @memberof API
 */
function getTicketForms(req, res, next) {
    _getTicketForms(req.user.zendesk).then(function(forms) {
        return res.status(200).json(forms);
    }).otherwise(function(err) {
        return next(new ServerError(err, req.path, err));
    });
}

module.exports = {
    getTicketForms: getTicketForms
};