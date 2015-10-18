var frisby = require("frisby");
frisby.create("post Schedule call sip")
    .post("https://api.ubicall.com/v1/sip/call", {
        device_token: "b2f6378e59bd322016381a290d7a21c160138177b31ae368f3ab359112cd421a",
        sip: "10003000000000224",
        license_key: "29kwX5FfFDQP",
        json: "31.33116187",
        longitude: "31.33116187",
        latitude: "31.30.10175607",
        pstn: 0,
        address: "38%20El%20Rayad%20(null)%20Misr%20Al%20Gadida%20Cairo%20Egypt",

        queue_id: 5
    })
    .expectStatus(200)

.expectJSON({
        message: "call scheduled successfully"

    })
    .toss();

/////////////////////////////////
frisby.create("git Schedule call sip")
    .get("https://api.ubicall.com/v1/sip/call", {
        device_token: "b2f6378e59bd322016381a290d7a21c160138177b31ae368f3ab359112cd421a",
        sip: "10003000000000224",
        license_key: "29kwX5FfFDQP",
        json: "31.33116187",
        longitude: "31.33116187",
        latitude: "31.30.10175607",
        pstn: 0,
        address: "38%20El%20Rayad%20(null)%20Misr%20Al%20Gadida%20Cairo%20Egypt",

        queue_id: 5
    })
    .expectStatus(404)

.toss();

///////////////////////////////////////////////
frisby.create("Missed Params Schedule call sip")
    .post("https://api.ubicall.com/v1/sip/call", {

        sip: "10003000000000224",
        license_key: "29kwX5FfFDQP",
        json: "31.33116187",
        longitude: "31.33116187",
        latitude: "31.30.10175607",
        pstn: 0,
        address: "38%20El%20Rayad%20(null)%20Misr%20Al%20Gadida%20Cairo%20Egypt",

        queue_id: 5
    })
    .expectStatus(422)


.toss();
////////////////////////////////////////////
frisby.create("device token is undefined or cannot schedule web or sip call")
    .post("https://api.ubicall.com/v1/sip/call", {
        device_token: "b2f6378easdasdasdasdasd3ab359112cd421a",
        sip: "10003000000000224",
        license_key: "29kwX5FfFDQP",
        json: "31.33116187",
        longitude: "31.33116187",
        latitude: "31.30.10175607",
        pstn: 0,
        address: "38%20El%20Rayad%20(null)%20Misr%20Al%20Gadida%20Cairo%20Egypt",

        queue_id: 5
    })
    .expectStatus(500)

.toss();