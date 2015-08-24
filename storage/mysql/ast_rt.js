var when = require('when');
var Sequelize = require('sequelize');

var settings, _sequelize;

function sequlizeImport(model) {
  return _sequelize.import(__dirname + "/../models/ast_rt/" + model);
}

function init(_settings) {
  return when.promise(function(resolve, reject) {
    settings = _settings;
    _sequelize = new Sequelize(settings.storage.ast_rt_mysql.database,
      settings.storage.ast_rt_mysql.username, settings.storage.ast_rt_mysql.password, {
        host: settings.storage.ast_rt_mysql.host,
        dialect: 'mysql',
        define: {
          freezeTableName: true,
          timestamps: false
        },
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        }
      });
    $sipfriends = sequlizeImport('sipfriends');
    return resolve({});
  });
}

function createSipFriend(sip , password) {
  return when.promise(function(resolve, reject) {
    $sipfriends.create({
      name: sip,
      regserver: 'ubicall_demo',
      host: 'dynamic',
      type: 'friend',
      context: 'ubicalldemo',
      secret: password,
      transport: 'tcp,udp',
      dtmfmode: 'rfc2833',
      nat: 'force_rport,comedia',
      disallow: 'all',
      allow: 'gsm',
      rtptimeout: '60',
      rtpholdtimeout: '300',
      faxdetect: 'no'
    }).then(function(sipfriends) {
      result = {};
      result.sip = sip;
      result.password = password;
      result.domain = domain;
      return resolve(result);
    }).catch(function(error) {
      return rejcet(error)
    });
  });
}

module.exports = {
  init: init,
  createSipFriend: createSipFriend
}
