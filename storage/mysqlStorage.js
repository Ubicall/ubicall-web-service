var when = require('when');
var Sequelize = require('sequelize');
var moment = require('moment');


var settings, _sequelize;
var calls, agent, queueAgent;

function sequlizeImport(model) {
  return _sequelize.import(__dirname + "/models/" + model);
}

function init(_settings) {
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

    return resolve({});
  });
}

function scheduleCall(call) {
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
      return resolve(call);
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
    }).catch(function(error){
      return rejcet(error)
    });
  });
}



function getQueue(key) {
  return when.promise(function(resolve, rejcet) {
    $admin.find({ licence_key : key}).then(function(admin) {

      $queue.find({ admin_id : admin.id}).then(function(queue) {
      
      }).then(function(queue) {
        return resolve(queue);
      }).catch(function(error) {
        return reject(error);
      });
    }).catch(function(error){
      return rejcet(error)
    });
  });
}

module.exports = {
  init: init,
  scheduleCall: scheduleCall,
  cancelCall : cancelCall
}
