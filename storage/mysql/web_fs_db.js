var when = require('when');
var Sequelize = require('sequelize');
var moment = require('moment');
var log = require('../../log');

var settings, _sequelize;
var $directory , $directoryParams;

function sequlizeImport(model) {
  return _sequelize.import(__dirname + "/../models/web_fs_db/" + model);
}

function init(_settings) {
  return when.promise(function(resolve, reject) {
    settings = _settings;
    var _host = settings.storage.web_fs_db_mysql.external_ip;
    var _port = settings.storage.web_fs_db_mysql.external_port;
    if(!process.env.db_env || process.env.db_env == "internal" ){
      _host = settings.storage.web_fs_db_mysql.internal_ip;
      _port = settings.storage.web_fs_db_mysql.internal_port;
    }
    _sequelize = new Sequelize(settings.storage.web_fs_db_mysql.database,
      settings.storage.web_fs_db_mysql.username, settings.storage.web_fs_db_mysql.password, {
        host: _host || 'localhost',
        port: _port || '3306',
        dialect: 'mysql',
        define: {
          freezeTableName: true,
          timestamps: false
        },
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        logging : log.data
      });
      _sequelize.authenticate().then(function(){
        log.info("connected successfully to DB => " + settings.storage.web_fs_db_mysql.database + ":" + _host + ":" + _port);
      }).catch(function(error){
        log.error("Unable to connect to DB => " + settings.storage.web_fs_db_mysql.database + ":" + _host + ":" + _port);
        throw error;
      });
    $directory = sequlizeImport('directory');
    $directoryParams = sequlizeImport('directory_params');
    return resolve({});
  });
}

function createSipDirectory(sip) {
  return when.promise(function(resolve, reject) {
    $directory.create({
      username : sip ,
      domain_id : 5 ,
      cache : 0,
      creation_date : moment().format(settings.call.date_format)
    }).then(function(directory) {
      if(!directory){
        return reject('cannot create directory');
      }
      return resolve(directory);
    }).catch(function(error) {
      return reject(error)
    });
  });
}

/**
* @param directory an instance of $directory
* @param password is sip password
**/
function createSipDirectoryParams(directory , password){
  return when.promise(function(resolve,reject){
    $directoryParams.create({
      directory_id : directory.id,
      param_name : "password",
      param_value : password
    }).then(function(dparam){
      $directoryParams.create({
        directory_id : directory.id,
        // dialString is static string '\${rtmp_contact(default/\${dialed_user}@Client's_Web_Voice_Server_IP )}'
        param_name : "dial-string",
        param_value : "${rtmp_contact(default/\${dialed_user}@" +  settings.infra.clientServer.web_voice_server.external_ip + ")}"
      }).then(function(dparam2){
        if(!dparam2){
          return reject('cannot create directoryParams');
        }
        return resolve(dparam ,dparam2);
      }).catch(function(error){
        return reject(error);
      });
    }).catch(function(error){
      return reject(error);
    });
  });
}

module.exports = {
  init: init,
  createSipDirectory : createSipDirectory,
  createSipDirectoryParams: createSipDirectoryParams
}
