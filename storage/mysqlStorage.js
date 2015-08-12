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
    $version = sequlizeImport('version');
    $client = sequlizeImport('client');
    $feedback = sequlizeImport('feedback');
      

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

      $queue.findAll({
       where: { admin_id : admin.id},
        attributes: ['id', 'name']
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




function feedback(data) {
  return when.promise(function(resolve, rejcet)  {

     $feedback.create({
      call_id: data.call_id,
      feedback: data.feedback,
      feedback_text: data.feedback_text
    }).then(function(feedback) {
      return resolve(feedback);
    }).catch(function(error){
      return rejcet(error)
    });
  });
}



function updateIVR(data) {
  return when.promise(function(resolve, rejcet)  {
 $client.findOne({ licence_key : data.licence_key}).then(function(client) {

  $version.findOne({ client_id : client.id}).then(function(version) {

    return version.updateAttributes({
        server_id: data.server_id, server_id: data.url,server_id: data.url
      }).then(function(updated) {
        return resolve(updated);
      }).catch(function(error) {
        return reject(error);
      });

  }).catch(function(error){
      return rejcet(error)
    });
      
    }).catch(function(error){
      return rejcet(error)
    });
  });
}



function getClients() {
  return when.promise(function(resolve, rejcet) {

  $version.hasMany(Post, {foreignKey: 'client_id'})
$client.hasMany(User, {foreignKey: 'id'})
      $client.findAll({
       where: { enabled : 1},include: [version]
     }).then(function(clients) {
        return resolve(clients);
      }).catch(function(error) {
        return reject(error);
      });
   
  });
}



module.exports = {
  init: init,
  scheduleCall: scheduleCall,
  cancelCall : cancelCall,
  getQueue : getQueue,
  feedback : feedback,
  checkIVR : checkIVR
  getClients : getClients
}
