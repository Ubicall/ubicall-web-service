var when = require('when');
var Sequelize = require('sequelize');
var moment = require('moment');

var randomstring = require("randomstring");
var sprintf = require("sprintf-js").sprintf,

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
    $version = sequlizeImport('version');
    $demo_calls = sequlizeImport('demo_calls');
    $device_sip = sequlizeImport('device_sip');

    $feedback = sequlizeImport('feedback');
    $sipfriends = sequlizeImport('sipfriends');
    $client_version_view = sequlizeImport('client_version_view');

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
    $client_version_view.findOne({
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
    $client_version_view.findOne({
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



function getQueue(key) {
  return when.promise(function(resolve, rejcet) {
    $admin.find({ licence_key : key}).then(function(admin) {

      if (typeof admin[index] !== 'undefined' && admin[index] !== null) {

      $queue.findAll({
       where: { admin_id : admin.id},
       attributes: ['id', 'name']
     }).then(function(queue) {
      return resolve(queue);
    }).catch(function(error) {
      return reject(error);
    });


  }

  else{

    return resolve('Invaled Key');
  }

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
   $client_version_view.findOne({ licence_key : data.licence_key}).then(function(client) {

  if (typeof client[index] !== 'undefined' && client[index] !== null) {


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

  }
  else {

      return resolve('Invaled Key');
  }

  }).catch(function(error){
    return rejcet(error)
  });
});
}



function getClients() {
  return when.promise(function(resolve, rejcet) {


    $client_version_view.findAll({
     where: { enabled : 1},
       attributes: ['name', 'licence_key','url']
   }).then(function(clients) {
    if(!clients){
      return resolve('No Clients Found ');
    }

    return resolve(clients);
  }).catch(function(error) {
    return reject(error);
  });

});
}

function getsip(data) {
  return when.promise(function(resolve, rejcet) {
    $device_sip.findOne({
     where: { device_token : data.device_token}
   }).then(function(device_sip) {
      result={};

      result.sip=device_sip.sip;
      result.password=device_sip.password;
      result.domain=device_sip.domain;
      return resolve(result);
}
    else{

     $client_version_view.findOne({
       where: { licence_key : data.licence_key},
       {order: 'id DESC'}
     }).then(function(client) {
       if(!client){
         return reject('no client found');
       }
      var sip =client.count+1;
      sip=sprintf("[%'09s]", sip);
      sip=client.id+"000"+ sip;
      var domain     ="104.239.166.30";
      var password =randomstring.generate(16);


      $device_sip.create({
        sdk_name : data.sdk_name,
        sdk_version : data.sdk_version,
        device_token : data.device_token,
        device_name : data.device_name,
        device_model : data.device_model,
        licence_key : data.licence_key,
        sip : sip,
        password : password,
        domain : domain

      }).then(function(devicesip) {

        client.update({
          count: client.count+1,
        }, {
          where: {
            id : client.id
          }
        }).then(function(update) {


         $sipfriends.create({
          name : sip,
          regserver : 'ubicall_demo',
          host : 'dynamic',
          type : 'friend',
          context : 'ubicalldemo',
          secret :password ,
          transport :'tcp,udp',
          dtmfmode : 'rfc2833',
          nat : 'force_rport,comedia',
          disallow : 'all',
          allow : 'gsm',
          rtptimeout : '60',
          rtpholdtimeout : '300',
          faxdetect : 'no'

        }).then(function(sipfriends) {
          result={};

          result.sip=sip;
          result.password=password;
          result.domain=domain;
          return resolve(result);

        }).catch(function(error){
          return rejcet(error)
        });

      }).catch(function(error){
        return rejcet(error)
      });

    }).catch(function(error){
      return rejcet(error)
    });

  }).catch(function(error) {
    return reject(error);
  });

}
;
  }).catch(function(error) {
    return reject(error);
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
  scheduleDemoCall:scheduleDemoCall,
  getQueue : getQueue,
  feedback : feedback,
  checkIVR : checkIVR,
  getClients : getClients,
  getsip : getsip

}
