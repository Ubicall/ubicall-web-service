var frisby = require('frisby');
frisby.create('post web Account')
  .post('https://api.ubicall.com/v1/web/account',{
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

  .expectJSONTypes( {
    username: String,
    password: String,
    domain:String
   
  })
.toss();

///////////////////////////////////

frisby.create('Missed Params web Account')
  .post('https://api.ubicall.com/v1/web/account',{
        sdk_name: "ubcall1",
        sdk_version: 1.0,
        deviceuid: "32FCB73C-A977-43FB-B5A1-3E4F330F60D9",
        device_token: "be9d0cb77f881796dfecaebfb3f89c8a12143c17fdd23f06ecd7863cb05eadf2",
        device_name: "Khaled%E2%80%99s%20iPhone",
        device_model: "iPhone",
        device_version: 8.4,
        license_key: "e6053eb8d35e02ae40beeeacef203c1a"
    })
  .expectStatus(422)

  .expectJSON( {
  message:'Validation Failed',


  })
.toss();
/////////////////////////////////
frisby.create('client not found web Account')
  .post('https://api.ubicall.com/v1/web/account',{
        sdk_name: "ubcall1",
        sdk_version: 1.0,
        deviceuid: "32FCB73C-A977-43FB-B5A1-3E4F330F60D9",
        device_token: "be9d0cb77f881796dfecaebfb3f89c8a12143c17fdd23f06ecd7863cb05eadf2",
        device_name: "Khaled%E2%80%99s%20iPhone",
        device_model: "iPhone",
        device_version: 8.4,
        license_key: "e6053eb8d35easdasdas02ae40beeeacef203c1a"
    })
  .expectStatus(403)

  .expectJSON( {
  message:'message:Bad credentials',

  })
.toss();

/////////////////////////////////////
frisby.create('get web Account')
  .get('https://api.ubicall.com/v1/web/account',{
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


