/**
 * API EndPoints
 * @version 0.0.1
 * @module api/v1/index
 * @exports .
 * @namespace API
 */
var express = require("express");
var when = require("when");
var bodyParser = require("body-parser");
var cors = require("cors");
var multer = require("multer");
var ubicallCors = require("../../ubicallCors");
var ubicallLogger = require("../logger").log;
var sip = require("./sip");
var call = require("./call");
var email = require("./email");
var agent = require("./agent");
var queue = require("./queue");
var ivr = require("./ivr");
var zendesk = require("./3rd/zendesk/ticket");
var midware = require("./utils/midware");
var errorHandler = require("../errorHandler");
var NotImplementedError = require("../errors").NotImplementedError;
var BadRequest = require("../errors").BadRequest;
var MissedParams = require("../errors").MissedParams;
var Forbidden = require("../errors").Forbidden;
var ServerError = require("../errors").ServerError;
var NotFound = require("../errors").NotFound;
var needsPermission = require("ubicall-oauth").needsPermission;
var passport = require("passport");
var helmet = require("helmet");
var thirdApp = require("./3rd");
var Limiter = require("../limiter");
var settings, storage;
var apiApp;

function init(_settings, _storage) {
    return when.promise(function(resolve, reject) {
        settings = _settings;
        storage = _storage;
        apiApp = express();

        var upload = multer({
            dest: settings.cdn.agent.avatarDestinationFolder
        });

        apiApp.use(passport.initialize());
        apiApp.use(bodyParser.urlencoded({
            extended: true
        }));
        apiApp.use(bodyParser.json());
        // apiApp.use(cors(ubicallCors.options));
        // apiApp.use(ubicallCors.cors);
        apiApp.use(helmet());
        apiApp.use(ubicallLogger);

        apiApp.post("/sip/call/:queue_id/:queue_name", needsPermission("sip.call.write"), Limiter.rateLimiter, midware.callExtract, call.createSipCall);

        apiApp.post("/sip/call", needsPermission("sip.call.write"), Limiter.rateLimiter, midware.callExtract, call.createSipCall);

        apiApp.post("/web/call/:queue_id/:queue_name", needsPermission("web.call.write"), Limiter.rateLimiter, midware.callExtract, call.createWebCall);

        apiApp.post("/web/call", needsPermission("web.call.write"), Limiter.rateLimiter, midware.callExtract, call.createWebCall);

        apiApp.delete("/call/:call_id", needsPermission("call.delete"), Limiter.rateLimiter, call.cancel);

        apiApp.get("/call/:call_id", needsPermission("call.read"), Limiter.rateLimiter, midware.isCallExist, call.getDetail);

        apiApp.get("/call/queue/:queue_id/:queue_slug", needsPermission("call.make"), Limiter.rateLimiter, midware.ensureRTMP, call.call);

        apiApp.put("/call/:call_id/done", needsPermission("call.write"), Limiter.rateLimiter, midware.isCallExist, call.done);

        apiApp.put("/call/:call_id/failed", needsPermission("call.write"), Limiter.rateLimiter, midware.isCallExist, call.failed);

        apiApp.post("/call/:call_id/feedback", needsPermission("feedback.write"), Limiter.rateLimiter, call.submitFeedback);

        apiApp.put("/call/:call_id/feedback", needsPermission("feedback.write"), Limiter.rateLimiter, call.submitFeedback);

        apiApp.post("/sip/account", needsPermission("sip.account.write"), Limiter.rateLimiter, sip.createSipAccount);

        apiApp.post("/web/account", needsPermission("web.account.write"), Limiter.rateLimiter, sip.createWebAccount);

        apiApp.get("/ivr", needsPermission("ivr.read"), Limiter.rateLimiter, ivr.fetchIvr);

        apiApp.post("/ivr/:version", needsPermission("ivr.write"), Limiter.rateLimiter, ivr.deployIVR);

        apiApp.put("/ivr/:version", needsPermission("ivr.write"), Limiter.rateLimiter, ivr.deployIVR);

        apiApp.post("/agent", needsPermission("agent.write"), Limiter.rateLimiter, agent.update);

        apiApp.put("/agent", needsPermission("agent.write"), Limiter.rateLimiter, agent.update);

        apiApp.post("/agent/image", needsPermission("agent.write"), Limiter.rateLimiter, upload.single("image"), agent.updateImage);

        apiApp.put("/agent/image", needsPermission("agent.write"), Limiter.rateLimiter, upload.single("image"), agent.updateImage);

        apiApp.get("/agent/calls", needsPermission("agent.calls.read"), Limiter.rateLimiter, agent.calls);

        apiApp.get("/agent/queues", needsPermission("agent.calls.read"), Limiter.rateLimiter, agent.queues);

        apiApp.get("/workinghours/:zone/:queue", needsPermission("workinghours.read"), Limiter.rateLimiter, call._workingHours);

        apiApp.get("/email", needsPermission("email.read"), Limiter.rateLimiter, email.getEmail);

        apiApp.post("/email/:email_id/:email_name", needsPermission("email.write"), Limiter.rateLimiter, email.sendEmail);

        apiApp.post("/email", needsPermission("email.write"), Limiter.rateLimiter, email.sendEmail);

        apiApp.get("/queue", needsPermission("-"), Limiter.rateLimiter, queue.fetchAdminQueues);

        apiApp.get("/_/cache/reset", needsPermission("-"), Limiter.rateLimiterReset);

        thirdApp.init(_settings, _storage).then(function(thridPartyApp) {
            apiApp.use("/3rd", thridPartyApp);
        });

        apiApp.use(errorHandler.log);
        apiApp.use(errorHandler.handle);


        return resolve(apiApp);
    });
}

module.exports = {
    init: init
};