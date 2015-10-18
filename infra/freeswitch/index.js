var when = require("when");
var log = require("../../log");
var esl = require("modesl");

var settings, eslClient;


function fs_command(cmd) {
    return when.promise(function(resolve, reject) {
        log.verbose("FREESWITCH : " + cmd);
        eslClient.api(cmd, function(res) {
            var rebody = res.getBody().trim();
            if (/^\-ERR.*$/.test(rebody)) {
                return reject(res.body);
            } else if (/^\+OK.*$/.test(rebody)) {
                return resolve({});
            } else {
                return reject("freeswitch: Unknown Response " + rebody);
            }
        });
    });
}




module.exports = {
    init: function(_settings) {
        return when.promise(function(resolve, reject) {
            settings = _settings;
            eslClient = new esl.Connection(settings.infra.agentServer.internal_ip || "127.0.0.1",
                settings.infra.agentServer.internal_port || 8012,
                settings.infra.agentServer.password || "ClueCon");
            return resolve({});
        });
    },
    /***
     * @param agent.rtmp :rtmp-session-id/user-number@server i.e. 80861ef0-1282-11e5-937a-1bcaae4c56bc/1100@104.239.164.247
     * @param call.phone :client-sip-number@server i.e. 5555@192.168.10.55
     */
    call: function(call, agent) {

        //call agent
        //      call client
        //          bridge these connections
        //            onError
        //              rejcet error
        return when.promise(function(resolve, reject) {

            if (!call.phone) {
                return reject("freeswitch:problem occurred while connecting to non existed client ...");
            }

            var fsCommand;
            if (call.caller_type === "2") { // flag mean this is usuall web call
                // TODO domain and port should be added to call record
                call.phone = call.phone + "@" +
                    settings.infra.clientServer.web_voice_server.internal_ip +
                    ":" + settings.infra.clientServer.web_voice_server.internal_ip;
                fsCommand = "originate rtmp/" + agent.rtmp + " &bridge(sofia/external/" + call.phone + ")";
            } else if (call.caller_type === "3") { // flag mean this is pstn phone call
                return reject("freeswitch:problem pstn phone calls not allowed yet");
            } else {
                call.phone = call.phone + "@" + settings.infra.clientServer.mobile_voice_server.internal_ip;
                fsCommand = "originate rtmp/" + agent.rtmp + " &bridge(sofia/external/" + call.phone + ")";
            }

            return fs_command(fsCommand)
                .then(function() {
                    return resolve({});
                }).otherwise(function(err) {
                    return reject("freeswitch:problem occurred while connecting between yours and your client ... ");
                });
        });
    },
    /***
     * @param agent :current agent
     * @param session (rtmp session):80861ef0-1282-11e5-937a-1bcaae4c56bc
     */
    logout: function(agent, session) {
        return when.promise(function(resolve, reject) {
            return fs_command("rtmp session " + session + " logout " + agent.sip)
                .then(function() {
                    return resolve({});
                }).otherwise(function(err) {
                    return reject(err);
                });
        });
    }
};