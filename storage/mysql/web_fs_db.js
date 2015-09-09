var when = require('when');
var Sequelize = require('sequelize');
var moment = require('moment');

var settings, _sequelize;
var $directory , $directoryParams;

function sequlizeImport(model) {
  return _sequelize.import(__dirname + "/../models/web_fs_db/" + model);
}

function init(_settings) {
  return when.promise(function(resolve, reject) {
    settings = _settings;
    _sequelize = new Sequelize(settings.storage.web_fs_db_mysql.database,
      settings.storage.web_fs_db_mysql.username, settings.storage.web_fs_db_mysql.password, {
        host: settings.storage.web_fs_db_mysql.host,
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
* @param directory and instance of $directory
* @param password is sip password
* @param dialString is static string '\${rtmp_contact(default/\${dialed_user}@162.242.253.195)}'
**/
function createSipDirectoryParams(directory , password , dialString){
  return when.promise(function(resolve,reject){
    $directoryParams.create({
      directory_id : directory.id,
      param_name : "password",
      param_value : password
    }).then(function(dparam){
      $directoryParams.create({
        directory_id : directory.id,
        param_name : "dial-string",
        param_value : dialString
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
