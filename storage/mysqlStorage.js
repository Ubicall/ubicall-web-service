var when = require('when');
var Sequelize = require('sequelize');
var moment = require('moment');

var settings, _sequelize;
var calls, agent, queueAgent, clients;

function sequlizeImport(model) {
  return _sequelize.import(__dirname + "/models/" + model);
}

function init(_settings){
  return when.promise(function(resolve, reject) {
    settings = _settings;
    _sequelize = new Sequelize(settings.storage.mysql.database,
      settings.storage.mysql.username, settings.storage.mysql.password, {
        host: settings.storage.mysql.host,
        dialect: settings.storage.storageModule,
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

    $agent = sequlizeImport('agent');
    $queueAgent = sequlizeImport('queue_agent');
    $calls = sequlizeImport('calls');
    $queue = sequlizeImport('queue');
    $clients = sequlizeImport('client');
    $version = sequlizeImport('version');
    $demo_calls = sequlizeImport('demo_calls');
    //  $company = sequlizeImport('company');
    $device_sip = sequlizeImport('device_sip');
    return resolve({});
  });
}
/**
* @param  object contain all necessary call attributes
* insert data into call Table
**/
function scheduleCall(call,device) {
  return when.promise(function(resolve, reject) {
    $calls.create({
      api_key: call.license_key,
      queue_id: call.queue,
      phone: call.sip,
      address: call.address,
      longitude: call.longitude,
      latitude: call.latitude,
      caller_type: call.pstn,
      call_data: call.call_data,
      schedule_time: call.time
    }).then(function(call) {
      console.log(call);
      return resolve(call);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

/**
* @param  object contain all necessary call attributes
* insert data into demp_call Table
**/
function scheduleDemoCall(call) {
  return when.promise(function(resolve, reject) {
    $demo_calls.create({
      api_key: call.license_key,
      queue_id: call.queue,
      phone: call.sip,
      address: call.address,
      longitude: call.longitude,
      latitude: call.latitude,
      caller_type: call.pstn,
      call_data: call.call_data,
      id_campaign:"1",

      created_time: call.time
    }).then(function(call) {
      return resolve(call);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

function getClient(key) {
  return when.promise(function(resolve,reject){
    $clients.findOne({
      where:{
        licence_key:key
      }
    }).then(function(client){
      if(!client){
          return reject("no result found");
      }
      return resolve(client);
    }).catch(function(error){
      return reject(error);
    });
  });
}

function getDevice(device) {
return when.promise(function(resolve,reject){
  $device_sip.findOne({
    where:{
      device_token:device
    }
  }).then(function(device){
    if(!device){
        return reject("no result found");
    }
    return resolve(device);
  }).catch(function(error){
    return reject(error);
  });
});
}
///Get Version API
function getVersion(key) {
  return when.promise(function(resolve, reject) {
    //Get Clients with a specific license_key
    $clients.findOne({
      where: {
        licence_key: key,
      }
    }).then(function(version) {
      if(!version){
        return reject('no version found');
      }
      //Now I have client attributes with a specific license_key
      return resolve(version);
    }).catch(function(error) {

      return reject(error);
    });
  });
}

function cancelCall(callId) {
  return when.promise(function(resolve, rejcet) {
    $calls.findById(callId).then(function(call) {
      // Now i have call and i should update it now withh cancel flag
      return call.updateAttributes({
        status: 'CANCELED'
      }).then(function(updated) {
        return resolve(updated);
      }).catch(function(error) {
        return reject(error);
      });
    }).catch(function(error) {
      return rejcet(error)
    });
  });
}

module.exports = {
  init: init,
  scheduleCall: scheduleCall,
  cancelCall: cancelCall,
  getVersion: getVersion,
  getDevice:getDevice,
  getClient:getClient,
  scheduleDemoCall:scheduleDemoCall
    //getAccountInfo: getAccountInfo
}
