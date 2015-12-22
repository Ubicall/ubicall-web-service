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
var log = require("../../../log");
var zendesk = require("./zendesk/ticket");
var zdTktFrms = require("./zendesk/ticket_forms");
var midware = require("../utils/midware");
var errorHandler = require("../utils/errorHandler");
var needsPermission = require("ubicall-oauth").needsPermission;
var hasZendeskCredinitial = require("./zendesk/utils.js").hasZendeskCredinitial;
var mzdmr = require("./zendesk/utils.js").matchZendeskMinimumTicketRequirement;
var passport = require("passport");
var settings, storage;
var app;

function init(_settings, _storage) {
    return when.promise(function(resolve, reject) {
        settings = _settings;
        storage = _storage;
        app = express();

        app.use(passport.initialize());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());
        app.post("/zendesk/ticket", needsPermission("zendesk.ticket.write"), hasZendeskCredinitial, mzdmr, zendesk.createTicket);
        app.get("/zendesk/ticket/forms", needsPermission("-"), hasZendeskCredinitial, zdTktFrms.getTicketForms);

        app.use(errorHandler.log);
        app.use(errorHandler.handle);


        return resolve(app);
    });
}
module.exports = {
    init: init
};