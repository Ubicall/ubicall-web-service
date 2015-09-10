var frisby = require('frisby');



frisby.create('get Fetch IVR')
  .get('https://api.ubicall.com/v1/ivr/e6053eb8d35e02ae40beeeacef203c1a')
  .expectStatus(200)

.toss();

////////////////////
frisby.create('Missed Params Fetch IVR')
  .get('https://api.ubicall.com/v1/ivr/')
  .expectStatus(404)


.toss();
////////////////////////////////


frisby.create('post Fetch IVR')
  .post('https://api.ubicall.com/v1/ivr/e6053eb8d35e02ae40beeeacef203c1a')
  .expectStatus(404)

.toss();

/////////////////////////



frisby.create('Fetch IVR license_key not found')
  .get('https://api.ubicall.com/v1/ivr/e6053eb8d35e0asdasfgf2ae40beeeacef203c1aa')
  .expectStatus(422)

.toss();