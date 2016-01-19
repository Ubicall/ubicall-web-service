var faker = require("faker");
var storage = require("./storage");

var HTTP_METHODS = ["GET", "POST", "HEAD", "DELETE"];
var STATUS_CODE = ["200", "300", "400", "500"];
var URLS = ["/sip/call", "/web/call", "/call", "/call/queue",
    "/workinghours", "/sip/account", "/web/account", "/email",
    "/ivr", "/agent", "/agent/image", "/agent/calls", "/agent/queues", "/3rd/zendesk"
];
var CATEGORIES = ["call", "email", "ivr", "agent", "integration"];
var APP_ID = ["ubicall-mob-android", "ubicall-mob-ios",
    "ubicall-widget", "ubicall-agent", "ubicall-admin"
];
var REQUEST_STATUS = ["success", "failure"];

module.exports = {
    sinkFakeRequest: function() {
        for (var i = 0; i < 1000; i++) {
            storage.logRequest({
                url: faker.random.arrayElement(URLS),
                method: faker.random.arrayElement(HTTP_METHODS),
                params: {},
                body: {},
                query: {},
                licence_key: faker.random.uuid(),
                category: faker.random.arrayElement(CATEGORIES),
                app_id: faker.random.arrayElement(APP_ID),
                user_agent: faker.internet.userAgent(),
                user_ip: faker.internet.ip(),
                datetime: faker.date.recent(),
                status: faker.random.arrayElement(REQUEST_STATUS),
                status_code: faker.random.arrayElement(STATUS_CODE),
                error: ""
            });
        }
    }
}