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
var log = require("../../log");
var sip = require("./sip");
var call = require("./call");
var email = require("./email");
var agent = require("./agent");
var queue = require("./queue");
var ivr = require("./ivr");
var zendesk = require("./3rd/zendesk/ticket");
var midware = require("./utils/midware");
var errorHandler = require("./utils/errorHandler");
var NotImplementedError = require("./utils/errors").NotImplementedError;
var BadRequest = require("./utils/errors").BadRequest;
var MissedParams = require("./utils/errors").MissedParams;
var Forbidden = require("./utils/errors").Forbidden;
var ServerError = require("./utils/errors").ServerError;
var NotFound = require("./utils/errors").NotFound;
var needsPermission = require("ubicall-oauth").needsPermission;
var passport = require("passport");
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

        apiApp.post("/sip/call", needsPermission("sip.call.write"), midware.callExtract, call.createSipCall);

        apiApp.post("/web/call", needsPermission("web.call.write"), midware.callExtract, call.createWebCall);

        apiApp.delete("/call/:call_id", needsPermission("call.delete"), call.cancel);

        apiApp.get("/call/:call_id", needsPermission("call.read"), midware.isCallExist, call.getDetail);

        apiApp.get("/call/queue/:queue_id/:queue_slug", needsPermission("call.make"), midware.ensureRTMP, call.call);

        apiApp.put("/call/:call_id/done", needsPermission("call.write"), midware.isCallExist, call.done);

        apiApp.put("/call/:call_id/failed", needsPermission("call.write"), midware.isCallExist, call.failed);

        apiApp.post("/call/:call_id/feedback", needsPermission("feedback.write"), call.submitFeedback);

        apiApp.put("/call/:call_id/feedback", needsPermission("feedback.write"), call.submitFeedback);

        apiApp.post("/sip/account", needsPermission("sip.account.write"), sip.createSipAccount);

        apiApp.post("/web/account", needsPermission("web.account.write"), sip.createWebAccount);

        apiApp.get("/ivr", needsPermission("ivr.read"), ivr.fetchIvr);

        apiApp.post("/ivr/:version", needsPermission("ivr.write"), ivr.deployIVR);

        apiApp.put("/ivr/:version", needsPermission("ivr.write"), ivr.deployIVR);

        apiApp.post("/agent", needsPermission("agent.write"), agent.update);

        apiApp.put("/agent", needsPermission("agent.write"), agent.update);

        apiApp.post("/agent/image", needsPermission("agent.write"), upload.single("image"), agent.updateImage);

        apiApp.put("/agent/image", needsPermission("agent.write"), upload.single("image"), agent.updateImage);

        apiApp.get("/agent/calls", needsPermission("agent.calls.read"), agent.calls);

        apiApp.get("/agent/queues", needsPermission("agent.calls.read"), agent.queues);

        apiApp.get("/workinghours/:zone/:queue", needsPermission("workinghours.read"), call._workingHours);

        apiApp.get("/email", needsPermission("email.read"), email.getEmail);

        apiApp.post("/email", needsPermission("email.write"), email.sendEmail);

        apiApp.get("/queue", needsPermission("-"), queue.fetchAdminQueues);

        apiApp.post("/ticket", needsPermission("-"), zendesk.createTicket);

        apiApp.use(errorHandler.log);
        apiApp.use(errorHandler.handle);


        return resolve(apiApp);
    });
}

module.exports = {
    init: init
};