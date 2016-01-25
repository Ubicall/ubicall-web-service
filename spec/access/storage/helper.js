var faker = require("faker");
var moment = require("moment");

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

var LICENCE_KEYS = [];
for (var i = 0; i < 10; i++) {
    LICENCE_KEYS.push(faker.random.uuid());
}

var CREATE_DATES = [
    moment(),
    moment().hours(0).minutes(0).seconds(0),
    moment().add(1, "minutes"),
    moment().add(10, "minutes"),
    moment().add(20, "minutes"),
    moment().add(30, "minutes"),
    moment().add(40, "minutes"),
    moment().add(50, "minutes"),
    moment().subtract(1, "minutes"),
    moment().subtract(10, "minutes"),
    moment().subtract(20, "minutes"),
    moment().subtract(30, "minutes"),
    moment().subtract(40, "minutes"),
    moment().subtract(50, "minutes"),
    moment().add(1, "days"),
    moment().add(2, "days"),
    moment().add(3, "days"),
    moment().add(4, "days"),
    moment().subtract(1, "days"),
    moment().subtract(2, "days"),
    moment().subtract(3, "days"),
    moment().subtract(4, "days")
];

function genRequest(options){
      return {
          url: faker.random.arrayElement(options.urls || URLS),
          method: faker.random.arrayElement(options.httpMethods||HTTP_METHODS),
          params: {},
          body: {},
          query: {},
          licence_key: faker.random.arrayElement(options.licenceKeys || LICENCE_KEYS),
          category: faker.random.arrayElement(options.categories ||CATEGORIES),
          app_id: faker.random.arrayElement(options.appID || APP_ID),
          user_agent: faker.internet.userAgent(),
          user_ip: faker.internet.ip(),
          datetime: faker.random.arrayElement(options.dates ||CREATE_DATES),
          status: faker.random.arrayElement(options.requestStatus || REQUEST_STATUS),
          status_code: faker.random.arrayElement(options.statusCode || STATUS_CODE),
          error: ""
      };
}
module.exports = {
    getFakeRequest: genRequest,
    genRecentFakeRequest: function(count){
      var logs = [];
      if(count){
        for (var i = 0; i < count; i++) {
          logs.push(genRequest({dates : [moment()]}));
        }
      }else {
        logs.push(genRequest({dates : [moment()]}));
      }
      return logs;
    },
    genPastFakeRequest: function(count){
      return genRequest({
        dates :[
            moment().subtract(1, "days"),
            moment().subtract(2, "days"),
            moment().subtract(3, "days")
          ]});
    },
    genFutureFakeRequest: function(count){
      return genRequest({
        dates :[
            moment().add(1, "days"),
            moment().add(2, "days"),
            moment().add(3, "days")
          ]});
    }

};
