var frisby = require("frisby");

//base url to allow changing from dev to production testing easily
var baseURL = "https://api-dev.ubicall.com";


/*
Testing the /sip/account
Post sip account with all proper parameters Success
post Missed Params web Account negative case 422
post client not found sip Account  negative 403
get get Sip Account negative 404
*/

//this line is added to ignore problems in self signed SSL should be removed once we have a valid ssl on the dev.ubicall.com
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


frisby.create("post Sip Account")
    .post(baseURL + "/v1/sip/account", {
        sdk_name: "ubcall1",
        sdk_version: 1.0,
        deviceuid: "32FCB73C-A977-43FB-B5A1-3E4F330F60D9",
        device_token: "be9d0cb77f881796dfecaebfb3f89c8a12143c17fdd23f06ecd7863cb05eadf2",
        device_name: "Khaled%E2%80%99s%20iPhone",
        device_model: "iPhone",
        device_version: 8.4,
        license_key: "e6053eb8d35e02ae40beeeacef203c1a"
    })
    .expectStatus(200)

.expectJSONTypes({
        username: String,
        password: String,
        domain: String

    }).inspectJSON() //added inspectJSON to check the return on the console and see it
    .toss();

////////////////////////////////////////
frisby.create("Missed Params web Account")
    .post(baseURL + "/v1/sip/account", {

        sdk_name: "ubcall1",
        // sdk_version: 1.0,
        deviceuid: "32FCB73C-A977-43FB-B5A1-3E4F330F60D9",
        device_token: "be9d0cb77f881796dfecaebfb3f89c8a12143c17fdd23f06ecd7863cb05eadf2",
        device_name: "Khaled%E2%80%99s%20iPhone",
        device_model: "iPhone",
        device_version: 8.4,
        license_key: "e6053eb8d35e02ae40beeeacef203c1a"
    })
    .expectStatus(422)

.expectJSON({
        message: "Validation Failed",


    })
    .toss();
/////////////////////////////////////////////////////
frisby.create("client not found Sip Account")
    .post(baseURL + "/v1/sip/account", {
        sdk_name: "ubcall1",
        sdk_version: 1.0,
        deviceuid: "32FCB73C-A977-43FB-B5A1-3E4F330F60D9",
        device_token: "be9d0cb77f881796dfecaebfb3f89c8a12143c17fdd23f06ecd7863cb05eadf2",
        device_name: "Khaled%E2%80%99s%20iPhone",
        device_model: "iPhone",
        device_version: 8.4,
        license_key: "e6053eb8d35easdasdasdasd02sdfsdfsdfae40beeeacef203c1a"
    })
    .expectStatus(403)

.expectJSON({
        message: "Bad credentials",

    })
    .toss();

////////////////////////////////////////////////////////////
frisby.create("get Sip Account")
    .get(baseURL + "/v1/sip/account", {
        sdk_name: "ubcall1",
        sdk_version: 1.0,
        deviceuid: "32FCB73C-A977-43FB-B5A1-3E4F330F60D9",
        device_token: "be9d0cb77f881796dfecaebfb3f89c8a12143c17fdd23f06ecd7863cb05eadf2",
        device_name: "Khaled%E2%80%99s%20iPhone",
        device_model: "iPhone",
        device_version: 8.4,
        license_key: "e6053eb8d35e02ae40beeeacef203c1a"
    })
    .expectStatus(404)

.toss();