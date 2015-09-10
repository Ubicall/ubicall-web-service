var frisby = require('frisby');



frisby.create('PUT Update IVR')
  .put('https://api.ubicall.com/v1/ivr/e6053eb8d35e02ae40beeeacef203c1a/1440323204612')
  .expectStatus(200)

.toss();
////////////////////////////

frisby.create('POST Update IVR')
  .post('https://api.ubicall.com/v1/ivr/e6053eb8d35e02ae40beeeacef203c1a/1440323204612')
  .expectStatus(200)

.toss();
///////////////////////


frisby.create('get Update IVR')
  .get('https://api.ubicall.com/v1/ivr/e6053eb8d35e02ae40beeeacef203c1a/1440323204612')
  .expectStatus(404)

.toss();

/////////////////////////


frisby.create('Update IVR license_key not found')
  .post('https://api.ubicall.com/v1/ivr/e6053eb8d3asdaddfgdfg5e0sdfsdfsdfsfsdfsdfsdfsf2ae40beeeacef203c1a/1440323204612')
  .expectStatus(500)

.toss();
