var should = require("should");
var mongodb = require("../../../access/storage/mongo");
var helper = require("../helper");

var settings = {
  log:{
    mongo:{
      external_ip : "127.0.0.1",
      external_port: "27017",
      internal_ip : "127.0.0.1",
      internal_port: "27017",
      database: "ubicall_log"
    }
  }
}

describe('access/storage/mongo driver', function() {

    before(function(done){
      mongodb.init(settings).then(function(){
        done();
      }).otherwise(function(err){
        done(error);
      });
    });

    beforeEach(function(done) {

    });

    afterEach(function(done) {
        // TODO clear mongo
    });

    it('log with recent date',function(done) {


      mongodb.logRequest(helper.genRecentFakeRequest());


    });
});
