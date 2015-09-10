var frisby = require('frisby');



frisby.create('get clients')
  .get('http://api.ubicall.com/v1/clients')
  .expectStatus(200)

.toss();


////////////////////////////////


frisby.create('post clients')
  .post('https://api.ubicall.com/v1/clients')
  .expectStatus(404)

.toss();

/////////////////////////



