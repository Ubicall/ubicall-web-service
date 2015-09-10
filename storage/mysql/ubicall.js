var when = require('when');
var Sequelize = require('sequelize');
var moment = require('moment');
var randomstring = require("randomstring");
var sprintf = require("sprintf-js").sprintf;
var slug = require('slug');
var ast_rt = require('./ast_rt');
var log = require('../../log');

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
    var _host = settings.storage.ubicall_mysql.external_ip;
    var _port = settings.storage.ubicall_mysql.external_port;
    if(!process.env.db_env || process.env.db_env == "internal" ){
      _host = settings.storage.ubicall_mysql.internal_ip;
      _port = settings.storage.ubicall_mysql.internal_port;
    }
    _sequelize = new Sequelize(settings.storage.ubicall_mysql.database,
      settings.storage.ubicall_mysql.username, settings.storage.ubicall_mysql.password, {
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
      log.info("connected successfully to DB => " + settings.storage.ubicall_mysql.database + ":" + _host + ":" + _port);
    }).catch(function(error){
      log.error("Unable to connect to DB => " + settings.storage.ubicall_mysql.database + ":" + _host + ":" + _port);
      throw error;
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
      caller_type: call.caller_type,
      call_data: call.call_data,
      schedule_time: call.time
    }).then(function(call) {
      if(!call){
        return reject('cannot schedule call');
      }
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
      phone: call.sip,
      address: call.address,
      long: call.longitude,
      lat: call.latitude,
      id_campaign: "1",
      time : call.time || moment().format(settings.call.date_format),
      created_time: moment().format(settings.call.date_format)
    }).then(function(call) {
      if(!call){
        return reject('cannot schedule Demo call');
      }
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

function getVersion(key) {
  return when.promise(function(resolve, reject) {
    $client_version_view.findOne({
      where: {
        licence_key: key,
      }
    }).then(function(version) {
      if (!version) {
        return reject("no result found");
      }
      return resolve(version);
    }).catch(function(error) {

      return reject(error);
    });
  });
}

function cancelCall(callId) {
  return when.promise(function(resolve, reject) {
     $calls.update({
       status: settings.call.status.cancel
     },{
       where: { id : callId }
     }).then(function(){
       return resolve();
     }).catch(function(){
       return reject(error);
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
      if(!admin){
        return reject("no result found");
      }
      return resolve(admin);
    }).catch(function(error){
      return reject(error);
    });
  });
}

function getQueue(id){
  return when.promise(function(resolve,reject){
    $queue.findOne({
      where: {
      admin_id: id,
      }
    }).then(function(queue) {
      if(!queue){
        return reject("no result found");
      }
      return resolve(queue);
    }).catch(function(error){
      return reject(error);
    });
  });
}

function feedback(feedback) {
  return when.promise(function(resolve, reject) {
    if (!feedback.call_id) {
      return reject("no call found to sumit this feedback")
    }
    //update create to upsert , inside db the call id should be unique
    //TODO update time from server time to local time
    $feedback.create({
      call_id: feedback.call_id,
      feedback: feedback.feedback,
      feedback_text: feedback.feedback_text,
      time: moment().format(settings.call.date_format)
    }).then(function(feedback) {
      if(!feedback){
        return reject('cannot send feedback');
      }
      return resolve(feedback);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

function updateIVR(ivr) {
  return when.promise(function(resolve, reject) {
    $client_version_view.findOne({
      licence_key: ivr.license_key
    }).then(function(client) {
      if (client) {
        $version.findOne({
          client_id: client.id
        }).then(function(version) {
          if(!version){
            return reject('cannot find client');
          }
          return version.updateAttributes({
            server_id: ivr.version,
            version: ivr.version,
            url: ivr.url,
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
  return when.promise(function(resolve, reject) {
    $client_version_view.findAll({
      where: {
        enabled: 1
      },
      attributes: ['name', 'licence_key', 'url']
    }).then(function(clients) {
      if (!clients) {
        return reject("no result found");
      }
      return resolve(clients);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

//function to insert in device sip table used in get_sip api

function createSip(device, password , domain, sip) {
  return when.promise(function(resolve, reject) {
    $device_sip.create({
      sdk_name: device.sdk_name,
      sdk_version: device.sdk_version,
      device_token: device.token,
      device_name: device.name,
      device_model: device.model,
      licence_key: device.license_key,
      device_version : device.version,
      deviceuid : device.uid,
      sip: sip,
      password: password,
      domain: domain,
      creation_date:moment().format(settings.call.date_format)
    }).then(function(sipDevice) {
      if(!sipDevice){
      return reject ('cannot create sip Device');
    }
      return resolve(sipDevice);
    }).catch(function(error) {
      return reject(error);
    });
  });
}
//function to update client tabel used in get_sip api

function incrementClientCount(clientId) {
  return when.promise(function(resolve, reject) {
    $client.findOne({where : { id : clientId} }).then(function(client){
      client.increment('count').then(function(incremented){
        if(!incremented){
          return reject('cannot update client count');
        }
          return resolve(incremented);
      }).catch(function(error){
          return reject(error);
      });
    }).catch(function(error){
      return reject(error);
    });
  });
}

function getIVR(license_key){
  return when.promise(function(resolve,reject){
    $client_version_view.findOne({
      where: {
        licence_key : license_key
      }
    }).then(function(ivr) {
      if (!ivr) {
        return reject("no result found");
      }
      return resolve(ivr);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

function getCalls(agent , options) {
  return when.promise(function(resolve,reject){
    return $calls.findAll({
      where: {
        id_agent: agent.id,
        api_key: agent.api_key,
        status: settings.call.status.done
      },
      order: 'schedule_time DESC',
      offset: (options.page - 1) * options.per_page,
      limit: options.page * options.per_page
    }).then(function(calls) {
      return resolve(calls);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

function getQueues(_agent) {
  return when.promise(function(resolve,reject){
    var queues = [];
    return $queueAgent.findAll({
      where: {
        agent_id: _agent.id
      },
      attributes: ['queue_name', 'queue_id']
    }).then(function(_queues) {
      // now get calls waiting in this queue
      return when.all(_queues.map(function(queue) {
        return getQueueCallsCount(queue).then(function(count) {
          queue.setDataValue('calls' , count);
          queue.setDataValue('queue_slug' , slug(queue.queue_name));
          queues.push(queue);
        });
      })).then(function() {
        return resolve(queues);
      });
    }).catch(function(error) {
      return reject(error);
    });
  });
}

function getQueueCallsCount(_queue) {
  return when.promise(function(resolve, reject) {
    return $calls.count({
      where : Sequelize.and(
        { queue_id: _queue.queue_id },
        Sequelize.or(
          { status: {$eq: null} },
          { status: settings.call.status.retry }
        )
      )
    }).then(function(qCallsCount) {
      return resolve(qCallsCount);
    }).catch(function(err){
      return reject(err);
    });
  });
}

function updateAgentImage(agnt , image){
  var agnt = $agent.build(agnt);
  agnt.isNewRecord = false;
  return when.promise(function(resolve,reject){
    return agnt.updateAttributes({
      img : image
    }).then(function(updated){
      return resolve(updated);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

function updateAgent(agnt, data){
  var agnt = $agent.build(agnt);
  agnt.isNewRecord = false;
  return when.promise(function(resolve,reject){
    if(agnt.password == data.currentPass){
      var info = {};
      if(data.newPass){
        info.password = data.newPass;
      }
      if(data.image){
        info.img = data.image;
      }
      return agnt.updateAttributes(info).then(function(updated){
        return resolve(updated);
      }).catch(function(error) {
        return reject(error);
      });
    }else {
      return reject("password not match");
    }
  });
}

function getCallDetail(agent , call_id){
  return when.promise(function(resolve,reject){
    $calls.findOne({
      where: {
        id : call_id,
        api_key : agent.api_key
      }
    }).then(function(call) {
      if (!call) {
        return reject("no result found");
      }
      return resolve(call);
    }).catch(function(error) {
      return reject(error);
    });
  })
}

function getCall(agent , queue_id , queue_slug){
  return when.promise(function(resolve,reject){
    return $calls.findOne({
      where: Sequelize.and(
        { api_key: agent.api_key },
        { queue_id: queue_id },
        Sequelize.or(
          { status: {$eq: null} },
          { status: settings.call.status.retry }
        )
      ),
      //get call from this queue depend on schedule_time (FIFO)
      order: 'datetime_originate ASC , schedule_time ASC'
    }).then(function(call) {
      if(!call){
        return reject("no result found");
      }

      var start_at = moment().format(settings.call.date_format);
      var uAttrs = {
        id_agent: agent.id,
        agent: agent.email,
        status: settings.call.status.progress,
        start_time: start_at,
        date_init: start_at,
        time_init: start_at,
        retries: (call.retries && call.retries > 0) ? call.retries + 1 : 0,
        duration_wait: moment.utc(moment().diff(moment(call.schedule_time))).format(settings.call.duration_format),
        datetime_originate: start_at,
      };
      return call.updateAttributes(uAttrs).then(function(updated) {
        return resolve(updated);
      }).catch(function(error) {
        return reject(error);
      });
    }).catch(function(error) {
      return reject(error);
    });
  });
}

function markCallDone(call){
  return when.promise(function(resolve, reject) {
    var endat;
    if (call.duration){
      var copyInitDate = new Date(call.date_init.getTime());
      endat = copyInitDate.setSeconds(copyInitDate.getSeconds() + duration);
      endat = moment(endat).format(settings.call.duration_format);
    }else {
      endat = moment().format(settings.call.duration_format);
    }
    return call.updateAttributes({
      status: settings.call.status.done,
      date_end: endat,
      time_end: endat,
      end_time: endat,
      duration: moment.utc(moment(endat).diff(moment(call.date_init))).format(settings.call.duration_format)
    }).then(function(updated) {
      return resolve(updated);
    }).catch(function(error) {
      return reject(error);
    });
  });
}

function markCallFail(call){
  return when.promise(function(resolve, reject) {
    var uAttrs = {
      status : call.status || settings.call.status.retry,
      start_time:null,
      date_init: null,
      time_init: null,
      end_time: null,
      date_end: null,
      time_end: null,
      duration_wait: null,
      failure_cause: call.failure_cause,
      failure_cause_txt: call.failure_cause_txt
    };
    return call.updateAttributes(uAttrs).then(function(updated) {
      return resolve(updated);
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
  getDevice: getDevice,
  getClient: getClient,
  scheduleDemoCall: scheduleDemoCall,
  getQueue: getQueue,
  feedback: feedback,
  getAdmin:getAdmin,
  updateIVR: updateIVR,
  getIVR:getIVR,
  getClients: getClients,
  createSip: createSip,
  incrementClientCount: incrementClientCount,
  getQueues:getQueues,
  getCalls: getCalls,
  updateAgentImage : updateAgentImage,
  updateAgent: updateAgent,
  getCallDetail:getCallDetail,
  getCall : getCall,
  markCallDone: markCallDone,
  markCallFail: markCallFail
}
