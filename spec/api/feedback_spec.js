var frisby = require('frisby');



frisby.create('post feedback')
  .post('https://api.ubicall.com/v1/call/feedback/1',{
     feedback: "test",
        feedback_text: "test text"
    })
  .expectStatus(200)

.expectJSON( {
  message:'feedback sent successfully'

  })
.toss();
/////////////////////////////////////////

frisby.create('Missed Params feedback')
  .post('https://api.ubicall.com/v1/call/feedback/1',{
       
        
        feedback_text: "test text"
      
    })
  .expectStatus(422)


.toss();
////////////////////////////////




frisby.create('get feedback')
  .get('https://api.ubicall.com/v1/call/feedback/1',{
      feedback: "test",
        feedback_text: "test text"
    })
  .expectStatus(404)

.toss();

/////////////////////////



