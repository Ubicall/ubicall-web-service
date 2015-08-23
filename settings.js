var fs = require('fs');
var config = {};
var configFile = process.env.HOME + '/.conf/ubicall.js'
if( fs.existsSync(configFile) ){
    config = require(configFile);
} else {
  throw new Error(configFile + ' Not Found !!!')
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
        ubicall_mysql: {
            database: config.storage.mysql.ubicall.database,
            username: config.storage.mysql.ubicall.username,
            password: config.storage.mysql.ubicall.password,
            host: config.storage.mysql.ubicall.host
        },
        ast_rt_mysql: {
            database: config.storage.mysql.ast_rt.database,
            username: config.storage.mysql.ast_rt.username,
            password: config.storage.mysql.ast_rt.password,
            host: config.storage.mysql.ast_rt.host
        },
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
        redis: {
            host: config.cache.redis.host,
            port: config.cache.redis.port,
            //time to live ttl for calls in seconds - 600 seconds = 10 minute
            callsttl: 600,
            //time to live ttl for queues in seconds
            queuesttl: 600
        }
    },
    plistHost : config.defaultPlistHost,
    widgetHost : config.endPoints.widgetDeploy
}
