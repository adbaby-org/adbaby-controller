const adbaby = require('../.');
const superagent = require('superagent');
const model = require('adbaby-model');

async function test() {

  let client = new adbaby.AdbabyClient();

  let output = await client.authClient.signUp("paulc8347@gmail.com", "ABCDabcd1234!");

  // let output = await client.authClient.confirmSignUp("paulc8347@gmail.com", "316996");

  // let output = await client.authClient.resendConfirmationCode("paulc8347@gmail.com");

  console.log(output.error?.__type);

  // await client.authClient.signIn("paulc8347@gmail.com", "ABCDabcd1234!");

  // await client.userHandler.loadUser();
  // console.log(client.userHandler.user);

  // await client.auth.validateToken(token);

  //await superagent.get('http://localhost:8000/campaign')
  //  .auth(token, { type: 'bearer' })
  //  .query({ user: 'paulc8347@gmail.com' })
  //  .send({ orgId: 1, campaignId: 1, activationId: 1 })
  //  .then(resp => {
  //    console.log(resp.text);
  //  });

  // await superagent.put('http://localhost:8000/user/update')
  //   .auth(token, { type: 'bearer' })
  //   .query({ user: 'paulc8347@gmail.com' })
  //   .set('Content-Type', 'application/json')
  //   .send({ firstName: 'Paul' })
  //   .then(resp => {
  //     console.log(resp.text);
  //   });

}

test();