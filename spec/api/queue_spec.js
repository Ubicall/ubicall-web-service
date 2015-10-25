var frisby = require("frisby");

//base url to allow changing from dev to production testing easily
var baseURL = "https://api-dev.ubicall.com";
//this line is added to ignore problems in self signed SSL should be removed once we have a valid ssl on the dev.ubicall.com
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


/*
Testing the /queue to get the queues of the client with the supplied license key
get  queue with all proper parameters Success
post queue negative case 404
get  queue with all proper parameters but licese key is not found Negative case 404
get  queue no parameter of license supplied negative 404
*/


frisby.create("get Get Queue")
    .get(baseURL + "/v1/queue/e6053eb8d35e02ae40beeeacef203c1a")
    .expectStatus(200)
    .expectJSON({
        message: "queue retrieved successfully"

    }).inspectJSON()

.toss();



frisby.create("post Get Queue")
    .post(baseURL + "/v1/queue/e6053eb8d35e02ae40beeeacef203c1a")
    .expectStatus(404)




.toss();


frisby.create(" license key is not found Get Queue")
    .get(baseURL + "/v1/queue/e6053eb8dxcvxcvxcvxcvxcv35e02ae40beeeacef203c1a")
    .expectStatus(404)
    .expectJSON({
        message: "Not Found"

    })
    .inspectJSON()

.toss();



frisby.create("Missing parameters")
    .get(baseURL + "/v1/queue/")
    .expectStatus(404)


.toss();