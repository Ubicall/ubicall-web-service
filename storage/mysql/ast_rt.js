var when = require("when");
var Sequelize = require("sequelize");
var log = require("../../log");

var settings, _sequelize;
var $sipfriends;

function sequlizeImport(model) {
    return _sequelize.import(__dirname + "/../models/ast_rt/" + model);
}

function init(_settings) {
    return when.promise(function(resolve, reject) {
        settings = _settings;
        var _host = settings.storage.ast_rt_mysql.external_ip;
        var _port = settings.storage.ast_rt_mysql.external_port;
        if (!process.env.db_env || process.env.db_env === "internal") {
            _host = settings.storage.ast_rt_mysql.internal_ip;
            _port = settings.storage.ast_rt_mysql.internal_port;
        }
        _sequelize = new Sequelize(settings.storage.ast_rt_mysql.database,
            settings.storage.ast_rt_mysql.username, settings.storage.ast_rt_mysql.password, {
                host: _host || "localhost",
                port: _port || "3306",
                dialect: "mysql",
                define: {
                    freezeTableName: true,
                    timestamps: false
                },
                pool: {
                    max: 5,
                    min: 0,
                    idle: 10000
                },
                logging: log.data
            });
        _sequelize.authenticate().then(function() {
            log.info("connected successfully to DB => " + settings.storage.ast_rt_mysql.database + ":" + _host + ":" + _port);
        }).catch(function(error) {
            log.error("Unable to connect to DB => " + settings.storage.ast_rt_mysql.database + ":" + _host + ":" + _port);
            throw error;
        });
        $sipfriends = sequlizeImport("sipfriends");
        return resolve({});
    });
}

function createSipFriend(sip, password) {
    return when.promise(function(resolve, reject) {
        $sipfriends.create({
            name: sip,
            regserver: "ubicall_demo",
            host: "dynamic",
            type: "friend",
            context: "ubicalldemo",
            secret: password,
            transport: "tcp,udp",
            dtmfmode: "rfc2833",
            nat: "force_rport,comedia",
            disallow: "all",
            allow: "gsm",
            rtptimeout: "60",
            rtpholdtimeout: "300",
            faxdetect: "no"
        }).then(function(sipfriend) {
            if (!sipfriend) {
                return reject("no result found");
            }
            return resolve(sipfriend);
        }).catch(function(error) {
            return reject(error);
        });
    });
}

module.exports = {
    init: init,
    createSipFriend: createSipFriend
};