var frisby = require('frisby');



frisby.create('delete call')
  .delete('https://api.ubicall.com/v1/call/5')
  .expectStatus(200)

.toss();


frisby.create('not found call_id  delete call')
  .delete('https://api.ubicall.com/v1/call/5s')
  .expectStatus(500)

.toss();
////////////////////////////////


frisby.create('post delete call')
  .post('https://api.ubicall.com/v1/call/5')
  .expectStatus(404)

.toss();
/////////////////////////



