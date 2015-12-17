var should = require("should");
var request = require("supertest");
var express = require("express");
var sinon = require("sinon");
var when = require("when");

var zendesk = require("../../../../../api/v1/3rd/zendesk/ticket");

describe("zendesk ticket api", function() {
        
    var app;

    before(function() {
        app = express();
        app.use(express.json());
        app.post("/ticket",zendesk.createTicket);
    });
    
    it("create zendesk ticket", function(done) {
        request(app)
            .get("/ticket")
            .set("Accept", "application/json")
            .expect(200)
            .end(function(err,res) {
                if (err) {
                    throw err;
                }
                res.body.should.be.an.Array.and.have.lengthOf(3);
                done();
            });
    });
    
    
});