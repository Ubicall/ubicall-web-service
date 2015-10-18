var frisby = require("frisby");


//base url to allow changing from dev to production testing easily
var baseURL = "https://api.dev.ubicall.com";
//this line is added to ignore problems in self signed SSL should be removed once we have a valid ssl on the dev.ubicall.com
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


//this should only test the removal of this web service as we sholuldn"t have it

frisby.create("get clients")
    .get(baseURL + "/v1/clients")
    .expectStatus(404)
    .inspectJSON()

.toss();


////////////////////////////////


frisby.create("post clients")
    .post(baseURL + "/v1/clients")
    .expectStatus(404)

.toss();

/////////////////////////