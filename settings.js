var request = require('sync-request');
var log = require('./log');

var config = {};
var configUrl ;

process.env.node_env = process.env.node_env || 'development';
process.env.db_env = process.env.db_env || 'internal';

if(!process.env.config_version){
  log.help("You should specify configuration version to use, see README for detail")
  throw new Error("Missed config_version environment variable");
}

var CONFIG = "config_" + process.env.config_version + "_" + process.env.node_env + ".json";

if(process.env.node_env == 'test' || process.env.node_env == 'development'){
  configUrl = "http://developer.dev.ubicall.com/conf/" + CONFIG;
} else { // production
  configUrl = "http://developer.ubicall.com/conf/" + CONFIG;
}

var configResponse;
try {
    configResponse = request('GET', configUrl);
} catch (e) {
  (process.env.node_env == 'development' || process.env.node_env == 'test') ?
    log.help("make sure you update hosts file, see README for detail")
    : log.help("make sure you connect to right configuration server and  config_version is correct");
  throw e;
}

if (configResponse.statusCode >= 300) {
    (process.env.node_env == 'development' || process.env.node_env == 'test') ?
      log.help("make sure you update hosts file, see README for detail")
      : log.help("make sure your configuration version is correct");
    var err = new Error('Server responded with status code ' + configResponse.statusCode + ':\n' + configResponse.body);
    err.statusCode = configResponse.statusCode;
    err.headers = configResponse.headers;
    err.body = configResponse.body;
    throw err;
}
try {
    config = JSON.parse(configResponse.body.toString());
} catch (e) {
    log.help("Unable to parse configuration");
    throw e;
}


module.exports = {

  //TODO : use env variable for development environment to configure host we listen for
  host: '127.0.0.1',
  port: '4000',

  // nginx has all ssl responsibility to secure connections now
  //https: {
  //    key: fs.readFileSync('~/.conf/agent/ssl/ubicall.com.key'),
  //    cert: fs.readFileSync('~/.conf/agent/ssl/ubicall.com.chain.crt')
  //},

  storage: {
    // used as dialect when work with Sequelize , and will append 'Storage' to get it file in require
    // accept one of these value ['fake' , 'mysql']
    // if fake
    //      you can login with any email account and password is your email's username
    //      i.e.    username : xyz@sand.com
    //              password : xyz
    ubicallStorageModule: 'mysql',
    ubicall_mysql: config.storage.mysql.ubicall_db,
    ast_rt_mysql: config.storage.mysql.ast_rt,
    web_fs_db_mysql: config.storage.mysql.WEB_FS_DB,
    fake: {
      locale: 'de',
      options: { // these options take precedence in fakeStorage.js
        agent: {
          min: 200,
          max: 8000,
          precision: 17
        },
        queue: {
          min: 3,
          max: 20,
          precision: 1,
          calls: {
            min: 20,
            max: 200,
            precision: 7
          }
        },
        call: {
          min: 20,
          max: 200,
          precision: 7
        }
      }
    }
  },
  cache: {
    enabled: false,
    //should has element with same name contain configuration used with same file name under
    // caching directory(./caching) and implement methods in ./caching/index.js
    cacheModule: 'redis',
    redis: config.cache.redis
  },
  infra: {
    agentServer: config.voice_infra.agent_voice_server,
    clientServer: config.voice_infra.client_voice_server,
  },
  plistHost: config.defaultPlistHost,
  widgetHost: config.endPoints.widgetDeploy,

  //where to deploy API documentation
  apiDeployFolder: "/var/www/html/docs/",
  call: {
    status: {
      progress: 'PROGRESS',
      done: 'SUCCESSFUL',
      failure: 'FAILURE',
      retry: 'RETRY',
      cancel: 'CANCELED'
    },
    retry_till: 5,
    failure_code: 3,
    reset_code: 4,
    duration_format: "MMDDHHmm",
    date_format: "YYYY-MM-DD HH:mm:ss",
    //cache time to live ttl for calls in seconds - 600 seconds = 10 minute
    callsttl: 600,
    //cache time to live ttl for queues in seconds
    queuesttl: 600
  },
  cdn: {
    sharedStatic: '/var/www/static',
    agent: {
      avatarHost: 'https://cdn.ubicall.com/agent/avatar/',
      avatarDestinationFolder: '/var/www/agent/avatar/',
      staticDestinationFolder: '/var/www/agent/'
    }
  }
}
