var log = require("./log");

process.env.node_env = process.env.node_env || "development";
process.env.db_env = process.env.db_env || "internal";
process.env.config_version = process.env.config_version || 20150920;

var DEVENV = (process.env.node_env === "development" || process.env.node_env === "test");
if (DEVENV) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
}

module.exports = {

    //TODO : use env variable for development environment to configure host we listen for
    host: "127.0.0.1",
    port: "4000",

    // nginx has all ssl responsibility to secure connections now
    //https: {
    //    key: fs.readFileSync("~/.conf/agent/ssl/ubicall.com.key"),
    //    cert: fs.readFileSync("~/.conf/agent/ssl/ubicall.com.chain.crt")
    //},

    storage: {
        // used as dialect when work with Sequelize , and will append "Storage" to get it file in require
        // accept one of these value ["fake" , "mysql"]
        // if fake
        //      you can login with any email account and password is your email"s username
        //      i.e.    username : xyz@sand.com
        //              password : xyz
        ubicallStorageModule: "mysql",
        ubicall_mysql: {
            "database": process.env.DB_UBICALL_ENV_MYSQL_DATABASE,
            "username": process.env.DB_UBICALL_ENV_MYSQL_USER,
            "password": process.env.DB_UBICALL_ENV_MYSQL_PASSWORD,
            "external_ip": process.env.DB_UBICALL_PORT_3306_TCP_ADDR,
            "internal_port": process.env.DB_UBICALL_PORT_3306_TCP_PORT,
            "internal_ip": process.env.DB_UBICALL_PORT_3306_TCP_ADDR,
            "external_port": process.env.DB_UBICALL_PORT_3306_TCP_PORT
        },
        ast_rt_mysql: {
            "database": process.env.DB_AST_RT_ENV_MYSQL_DATABASE,
            "username": process.env.DB_AST_RT_ENV_MYSQL_USER,
            "password": process.env.DB_AST_RT_ENV_MYSQL_PASSWORD,
            "external_ip": process.env.DB_AST_RT_PORT_3306_TCP_ADDR,
            "internal_port": process.env.DB_AST_RT_PORT_3306_TCP_PORT,
            "internal_ip": process.env.DB_AST_RT_PORT_3306_TCP_ADDR,
            "external_port": process.env.DB_AST_RT_PORT_3306_TCP_PORT
        },
        web_fs_db_mysql: {
          "database": process.env.DB_WEB_FS_ENV_MYSQL_DATABASE,
          "username": process.env.DB_WEB_FS_ENV_MYSQL_USER,
          "password": process.env.DB_WEB_FS_ENV_MYSQL_PASSWORD,
          "external_ip": process.env.DB_WEB_FS_PORT_3306_TCP_ADDR,
          "internal_port": process.env.DB_WEB_FS_PORT_3306_TCP_PORT,
          "internal_ip": process.env.DB_WEB_FS_PORT_3306_TCP_ADDR,
          "external_port": process.env.DB_WEB_FS_PORT_3306_TCP_PORT
        },
        cache: {
            enabled: false,
            //should has element with same name contain configuration used with same file name under
            // caching directory(./caching) and implement methods in ./caching/index.js
            cacheModule: "redis",
            redis: {
                "username": "XXXXX",
                "password": "XXXXX",
                "internal_ip": process.env.REDIS_PORT_6379_TCP_ADDR,
                "internal_port": process.env.REDIS_PORT_6379_TCP_PORT
            }
        },
        infra: {
            agentServer: {
                "internal_ip": process.env.VOICE_INFRA_CLIENT_SERVER_MOBILE_EXTERNAL_IP,
                "internal_port": process.env.VOICE_INFRA_CLIENT_SERVER_MOBILE_INTERNAL_IP,
                "password": process.env.VOICE_INFRA_AGENT_SERVER_PASSWORD,
                "_comment": "FREESWITCH Server"
            },
            clientServer: {
                "mobile_voice_server": {
                    "external_ip": process.env.VOICE_INFRA_CLIENT_SERVER_MOBILE_EXTERNAL_IP,
                    "external_port": process.env.VOICE_INFRA_CLIENT_SERVER_MOBILE_INTERNAL_PORT,
                    "internal_ip": process.env.VOICE_INFRA_CLIENT_SERVER_MOBILE_INTERNAL_IP,
                    "internal_port": process.env.VOICE_INFRA_CLIENT_SERVER_MOBILE_EXTERNAL_PORT,
                    "_comment": "ASTERISK Server"
                },
                "web_voice_server": {
                    "external_ip": process.env.VOICE_INFRA_CLIENT_SERVER_WEB_EXTERNAL_IP,
                    "external_port": process.env.VOICE_INFRA_CLIENT_SERVER_WEB_INTERNAL_PORT,
                    "internal_ip": process.env.VOICE_INFRA_CLIENT_SERVER_WEB_INTERNAL_IP,
                    "internal_port": process.env.VOICE_INFRA_CLIENT_SERVER_WEB_EXTERNAL_PORT,
                    "_comment": "FREESWITCH Server"
                }
            },
        },
        plistHost: DEVENV ? "https://designer-dev.ubicall.com/plist/" : "https://designer.ubicall.com/plist/",
        widgetHost: DEVENV ? "https://platform-dev.ubicall.com/api/widget/" : "https://platform.ubicall.com/api/widget/",

        call: {
            status: {
                progress: "PROGRESS",
                done: "SUCCESSFUL",
                failure: "FAILURE",
                retry: "RETRY",
                cancel: "CANCELED"
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
            sharedStatic: "/var/www/static",
            agent: {
                avatarHost: "https://cdn.ubicall.com/agent/avatar/",
                avatarDestinationFolder: "/var/www/agent/avatar/",
                staticDestinationFolder: "/var/www/agent/"
            }
        }
    }
};