var when = require("when");
var request = require("request");
var ServerError = require("../../utils/errors").ServerError;
var log = require("../../../../log");

/**
 * curl https://ubicall.zendesk.com/api/v2/help_center/categories/{id}/sections.json -v -u {email_address}/token:{token}
 **/
function _getCategorySections(zd_cred, category_id) {
    return when.promise(function(resolve, reject) {
        if (!category_id) {
            return reject("No category id");
        }
        var options = {
            url: zd_cred.helpcenter + "/categories/" + category_id + "/sections.json",
            method: "GET",
            auth: {
                username: zd_cred.username,
                password: zd_cred.token
            }
        };
        request(options, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                return reject(error || response.statusCode);
            } else {
                var result = JSON.parse(body);
                return resolve(result.sections);
            }
        });
    });
}


/**
 * curl https://ubicall.zendesk.com/api/v2/help_center/categories.json -v -u {email_address}/token:{token}
 **/
function _getCategories(zd_cred) {
    return when.promise(function(resolve, reject) {
        var options = {
            url: zd_cred.helpcenter + "/categories.json",
            method: "GET",
            auth: {
                username: zd_cred.username,
                password: zd_cred.token
            }
        };
        request(options, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                return reject(error || response.statusCode);
            } else {
                var result = JSON.parse(body);
                return resolve(result.categories);
            }
        });
    });
}

module.exports = {
    getCategories: function(req, res, next) {
        _getCategories(req.user.zendesk).then(function(categories) {
            return res.status(200).json(categories);
        }).otherwise(function(err) {
            return next(new ServerError(err, req.path, err));
        });
    },
    getCategorySections: function(req, res, next) {
        _getCategorySections(req.user.zendesk, request.params.id).then(function(sections) {
            return res.status(200).json(sections);
        }).otherwise(function(err) {
            return next(new ServerError(err, req.path, err));
        });
    }
};