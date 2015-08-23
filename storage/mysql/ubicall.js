var when = require('when');
var Sequelize = require('sequelize');
var moment = require('moment');
var randomstring = require("randomstring");
var sprintf = require("sprintf-js").sprintf;
var ast_rt = require('./ast_rt');

var settings, _sequelize;
var calls, agent, queueAgent, clients;

function sequlizeImport(model) {
  return _sequelize.import(__dirname + "/../models/ubicall/" + model);
}
function sequlizeImport2(model) {
  return _sequelize.import(__dirname + "/../models/ast_rt/" + model);
}

function init(_settings) {
  return when.promise(function(resolve, reject) {
    settings = _settings;
    _sequelize = new Sequelize(settings.storage.ubicall_mysql.database,
      settings.storage.ubicall_mysql.username, settings.storage.ubicall_mysql.password, {
        host: settings.storage.ubicall_mysql.host,
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

    $agent = sequlizeImport('agent');
    $queueAgent = sequlizeImport('queue_agent');
    $calls = sequlizeImport('calls');
    $queue = sequlizeImport('queue');
    $version = sequlizeImport('version');
    $demo_calls = sequlizeImport('demo_calls');
    $device_sip = sequlizeImport('device_sip');
    $client = sequlizeImport('client');
    $feedback = sequlizeImport('feedback');
    $client_version_view = sequlizeImport('client_version_view');
    $sip_friends = sequlizeImport2('sipfriends.js');
    $admin = sequlizeImport('admin.js');
    return resolve({});
  });
}
/**
 * @param  object contain all necessary call attributes
 * insert data into call Table
 **/
function scheduleCall(call, device) {
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
      id_campaign: "1",
      created_time: call.time
    }).then(function(call) {
      return resolve(call);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

function getClient(key) {
  return when.promise(function(resolve, reject) {
    $client_version_view.findOne({
      where: {
        licence_key: key
      }
    }).then(function(client) {
      if (!client) {
        return reject("no result found");
      }
      return resolve(client);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

function getDevice(device) {
  return when.promise(function(resolve, reject) {
    $device_sip.findOne({
      where: {
        device_token: device
      }
    }).then(function(device) {
      if (!device) {
        return reject("no result found");
      }
      return resolve(device);
    }).catch(function(error) {
      return reject(error);
    });
  });
}
///Get Version API
function getVersion(key) {
  return when.promise(function(resolve, reject) { //Get Clients with a specific license_key

    $client_version_view.findOne({
      where: {
        licence_key: key,
      }
    }).then(function(version) {
      if (!version) {
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

function getAdmin(key){
  return when.promise(function(resolve,reject){
    $admin.findOne({
      where: {
        licence_key: key,
      }
    }).then(function(admin){
      return resolve(admin);
    }).catch(function(error){
      return reject(error);
    });
  });
}

function getQueue(id){
  return when.promise(function(resolve,rejcet){
    $queue.findOne({
      where: {
      admin_id: id,
      }
    }).then(function(queue) {
      return resolve(queue);
  }).catch(function(error){
    return reject(error);
  });
});
}

function feedback(feedback) {
  return when.promise(function(resolve, rejcet) {
    if (!feedback.call_id) {
      return rejcet("no call found to sumit this feedback")
    }
    //update create to upsert , inside db the call id should be unique
    //TODO update time from server time to local time
    $feedback.create({
      call_id: feedback.call_id,
      feedback: feedback.feedback,
      feedback_text: feedback.feedback_text,
      time: moment().format('YYYY-MM-DD HH:mm:ss')
    }).then(function(feedback) {
      return resolve(feedback);
    }).catch(function(error) {
      return rejcet(error);
    });
  });
}

function updateIVR(data) {
  return when.promise(function(resolve, reject) {
    $client_version_view.findOne({
      licence_key: data.license_key
    }).then(function(client) {
      if (client) {
        $version.findOne({
          client_id: client.id
        }).then(function(version) {
          return version.updateAttributes({
            server_id: data.server_id,
            version: data.server_id,
            url: data.url,
             where: {
                id:client.id,
              }
          }).then(function(updated) {
            return resolve(updated);
          }).catch(function(error) {
            return reject(error);
          });

        }).catch(function(error) {
          return reject(error);
        });
      }else {
        return reject('Invaled Key');
      }
    }).catch(function(error) {
      return reject(error)
    });
  });
}

function getClients() {
  return when.promise(function(resolve, rejcet) {
    $client_version_view.findAll({
      where: {
        enabled: 1
      },
      attributes: ['name', 'licence_key', 'url']
    }).then(function(clients) {
      if (!clients) {
        return reject('No Clients Found ');
      }
      return resolve(clients);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

//function to insert in device sip table used in get_sip api

function insert_into_sip(data) {
  return when.promise(function(resolve, reject) {
    $device_sip.create({
      sdk_name: data.sdk_name,
      sdk_version: data.sdk_version,
      device_token: data.device_token,
      device_name: data.device_name,
      device_model: data.device_model,
      licence_key: data.licence_key,
      sip: sip,
      password: password,
      domain: domain,
      creation_date:moment().format('YYYY-MM-DD HH:mm:ss')
    }).then(function(device) {
      return resolve(result);
    }).catch(function(error) {
      return reject(error);
    });
  });
}
//function to update client tabel used in get_sip api

function update_client(id) {
  return when.promise(function(resolve, reject) {
    $client.update({
      count: count + 1
    }, {
      where: {
        id:id
      }
    }).then(function(updated) {
      return resolve(updated);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

function insert_sipfriends(data,password,sip) {
  //TODO review this function
    return when.promise(function(resolve,reject){
      $sip_friends.create({
        name: sip,
        regserver:'ubicall_demo',
        host: 'dynamic',
        type: 'friend',
        context: 'ubicalldemo',
        secret :password ,
        transport :'tcp,udp' ,
        dtmfmode:'rfc2833' ,
        nat :'force_rport,comedia' ,
        disallow :'all' ,
        allow:'gsm' ,
        rtptimeout:'60' ,
        rtpholdtimeout:'300' ,
        faxdetect:'no'
      }).then(function(device){
        return resolve(result);

      }).catch(function(error){
        return reject (error);
      });
    });
}

module.exports = {
  init: init,
  scheduleCall: scheduleCall,
  cancelCall: cancelCall,
  getVersion: getVersion,
  getDevice: getDevice,
  getClient: getClient,
  scheduleDemoCall: scheduleDemoCall,
  getQueue: getQueue,
  feedback: feedback,
  getAdmin:getAdmin,
  updateIVR: updateIVR,
  getClients: getClients,
  insert_into_sip: insert_into_sip,
  insert_sipfriends: insert_sipfriends,
  update_client: update_client
}
