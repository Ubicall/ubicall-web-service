var frisby = require("frisby");
//base url to allow changing from dev to production testing easily
var baseURL = "https://api.dev.ubicall.com";

/*
Testing the /ivr service to deploy changes on the designer

PUT Update IVR Success Case
POST Update IVR Success Case


get Update IVR Negative Case 404
post Update IVR license_key not found  500

*/
//this line is added to ignore problems in self signed SSL should be removed once we have a valid ssl on the dev.ubicall.com
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


frisby.create("PUT Update IVR")
    .put(baseURL + "/v1/ivr/e6053eb8d35e02ae40beeeacef203c1a/1440323204612")
    .expectStatus(200)

.toss();
////////////////////////////

frisby.create("POST Update IVR")
    .post(baseURL + "/v1/ivr/e6053eb8d35e02ae40beeeacef203c1a/1440323204612")
    .expectStatus(200)

.toss();
///////////////////////


frisby.create("get Update IVR")
    .get(baseURL + "/v1/ivr/e6053eb8d35e02ae40beeeacef203c1a/1440323204612")
    .expectStatus(404)

.toss();

/////////////////////////


frisby.create("Update IVR license_key not found")
    .post(baseURL + "/v1/ivr/e6053eb8d3asdaddfgdfg5e0sdfsdfsdfsfsdfsdfsdfsf2ae40beeeacef203c1a/1440323204612")
    .expectStatus(500)

.toss();