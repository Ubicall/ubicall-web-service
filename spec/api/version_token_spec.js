var frisby = require('frisby');
frisby.create('get  version token')
  .get('https://api.ubicall.com/v1//ivr/e6053eb8d35e02ae40beeeacef203c1a')
  .expectStatus(200)

.toss();

//////////////////////////////
frisby.create('Missed Params version token')
  .get('https://api.ubicall.com/v1//ivr/')
  .expectStatus(404)


.toss();

///////////////////////////////
frisby.create('client notversion is found')
  .get('https://api.ubicall.com/v1//ivr/e6053eb8d3asdad5e0sdfsdfsdfsfsdfsdfsdfsf2ae40beeeacef203c1a')
  .expectStatus(404)

 
.toss();
/////////////////////////////////////
frisby.create('post version token')
  .post('https://api.ubicall.com/v1//ivr/e6053eb8d35e02ae40beeeacef203c1a')
  .expectStatus(404)


.toss();
