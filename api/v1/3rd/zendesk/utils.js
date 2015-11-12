var Forbidden = require("../../utils/errors").Forbidden;
var MissedParams = require("../../utils/errors").MissedParams;

/**
* lowerize object keys
**/
function _lowerizeObjectKeys(obj) {
    var keys = Object.keys(obj);
    var n = keys.length;
    while (n--) {
        var key = keys[n];
        obj[key.toLowerCase()] = obj[key];
        delete obj[key];
    }
}

/**
 * middleware to check if your request.user has zendesk credentials
 * @param {Object} req.user - request user
 * @param {Object} req.user.zendesk - zendesk credentials
 * @throws {@link Forbidden} if @param req.user.zendesk or one of his subitems don't exist
 * @memberof middleware
 */
function hasZendeskCredinitial(req, res, next) {
    if (req.user.zendesk) {
        next();
    } else {
        return next(new Forbidden({
            message: "must configure your zendesk account first"
        }, req.path));
    }
}

/**
 * middleware to check if your request.body has zendesk comment, beacuse it is required .
 * @param {Object} req.body - request body
 * @param {Object} req.body.comment - zendesk ticket comment
 * @throws {@link MissedParams} if @param req.body.comment is missing
 * @memberof middleware
 */
function matchZendeskMinimumTicketRequirement(req, res, next) {
    _lowerizeObjectKeys(req.body);
    req.body.comment = req.body.comment || req.body.subject || req.body.description;
    if (req.body.comment) {
        next();
    } else {
        return next(new MissedParams(req.path, ["comment"]));
    }
}

module.exports = {
    hasZendeskCredinitial: hasZendeskCredinitial,
    matchZendeskMinimumTicketRequirement: matchZendeskMinimumTicketRequirement
};