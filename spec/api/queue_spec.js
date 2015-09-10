var frisby = require('frisby');



frisby.create('post Get Queu')
  .post('https://api.ubicall.com/v1/queue/e6053eb8d35e02ae40beeeacef203c1a')
  .expectStatus(404)


 

.toss();


frisby.create(' license key is not found Get Queu')
  .get('https://api.ubicall.com/v1/queue/e6053eb8dxcvxcvxcvxcvxcv35e02ae40beeeacef203c1a')
  .expectStatus(422)
 .expectJSON( {
   message: 'Not Found'

  })

.toss();

////////////////////////////////




frisby.create('get Get Queu')
  .get('https://api.ubicall.com/v1/queue/e6053eb8d35e02ae40beeeacef203c1a')
  .expectStatus(200)
  .expectJSON( {
   message: 'queue retrieved successfully'

  })

.toss();

/////////////////////////



