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
            "database": "ubicall",
            "username": "ubiuser",
            "password": "UbIPaWd15dB@1",
            "external_ip": "23.253.158.160",
            "external_port": 3306,
            "internal_ip": "10.176.192.120",
            "internal_port": 3306
        },
        ast_rt_mysql: {
            "database": "ast_rt",
            "username": "ubiuser",
            "password": "UbIPaWd15dB@1",
            "external_ip": "23.253.158.160",
            "internal_ip": "10.176.192.120",
            "external_port": 3306
        },
        web_fs_db_mysql: {
            "database": "WEB_FS_DB",
            "username": "ubiuser",
            "password": "UbIPaWd15dB@1",
            "external_ip": "104.239.164.247",
            "internal_ip": "10.209.68.186",
            "external_port": 3306,
            "internal_port": 3306
        },
        cache: {
            enabled: false,
            //should has element with same name contain configuration used with same file name under
            // caching directory(./caching) and implement methods in ./caching/index.js
            cacheModule: "redis",
            redis: {
                "username": "XXXXX",
                "password": "XXXXX",
                "internal_ip": "127.0.0.1",
                "internal_port": "6379"
            }
        },
        infra: {
            agentServer: {
                "internal_ip": "104.239.164.247",
                "internal_port": "8021",
                "password": "UbiFS2015esl",
                "_comment": "FREESWITCH Server"
            },
            clientServer: {
                "mobile_voice_server": {
                    "external_ip": "104.239.166.30",
                    "external_port": 5060,
                    "internal_ip": "10.209.96.174",
                    "internal_port": 5060,
                    "_comment": "ASTERISK Server"
                },
                "web_voice_server": {
                    "external_ip": "162.242.253.195",
                    "external_port": 5080,
                    "internal_ip": "10.208.201.195",
                    "internal_port": 5080,
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