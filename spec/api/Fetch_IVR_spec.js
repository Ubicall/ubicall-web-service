var frisby = require("frisby");
//base url to allow changing from dev to production testing easily
var baseURL = "https://api-dev.ubicall.com";


//this line is added to ignore problems in self signed SSL should be removed once we have a valid ssl on the dev.ubicall.com
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


/*
Testing the /ivr service to deploy changes on the designer

get fetch ivr success case
get Missed Params Fetch IVR Negative case 404
post fetch IVR negative case Negative case 404
get IVR license_key not found  Negative 404

*/



frisby.create("get Fetch IVR")
    .get(baseURL + "/v1/ivr/e6053eb8d35e02ae40beeeacef203c1a")
    .expectStatus(200)

.toss();

////////////////////
frisby.create("Missed Params Fetch IVR")
    .get(baseURL + "/v1/ivr/")
    .expectStatus(404)


.toss();
////////////////////////////////


frisby.create("post Fetch IVR")
    .post(baseURL + "/v1/ivr/e6053eb8d35e02ae40beeeacef203c1a")
    .expectStatus(404)

.toss();

/////////////////////////



frisby.create("Fetch IVR license_key not found")
    .get(baseURL + "/v1/ivr/e6053eb8d35e0asdasfgf2ae40beeeacef203c1aa")
    .expectStatus(404)

.toss();