var when = require("when");
var settings, logStorageModule;

module.exports = {
    init: function(_settings) {
        settings = _settings;
        if (_settings.log.enabled && _settings.log.logModule) {
            logStorageModule = require("./" + _settings.log.logModule + "/index.js");
            return when.all([logStorageModule.init(_settings)]);
        }
        return when.resolve();
    },
    limitExceeded: function(licence_key, path, limit) {
        return when.resolve(logStorageModule.limitExceeded(licence_key, path, limit));
    }
};