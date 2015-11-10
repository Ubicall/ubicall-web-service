var Forbidden = require("../../utils/errors").Forbidden;

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

module.exports = {
    hasZendeskCredinitial: hasZendeskCredinitial
};