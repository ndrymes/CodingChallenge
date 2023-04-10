/* eslint-disable no-undef */
import { createApp } from 'src/app';
import request from 'supertest';

describe( 'Auth Controller', ()=>{

  let app: Express.Application;
  let token: string;

  beforeAll( async()=>{

    app = await createApp();

    const response = await request( app )
      .post( '/auth/register' )
      .send( {
        username: 'user1@mail.com',
        password: 'testpassword',
        role:     'BUYER'
      } );

    token = response.body.token;

  } );

  describe( 'POST account/deposit', ()=>{

    test( 'throw an error if user does not supply auth token', async()=>{

      const response = await request( app )
        .post( '/account/deposit' )
        .send( {
          amount: 100
        } );

      expect( response.status ).toEqual( 401 );

    } );

    test( 'throw an error if user does not supply auth token', async()=>{

      const response = await request( app )
        .post( '/account/deposit' )
        .send( {
          amount: 100
        } );

      expect( response.status ).toEqual( 401 );

    } );

    test( 'user should be able to deposit', async()=>{

      const response = await request( app )
        .post( '/account/deposit' )
        .set( 'Authorization', `Bearer ${ token }` )
        .send( {
          amount: 100
        } );

      expect( response.status ).toEqual( 200 );
      expect( response.body ).toHaveProperty( 'balance' );
      expect( response.body.balance ).toEqual( 100 );

    } );

    test( 'should reset deposit for user', async()=>{

      const response = await request( app )
        .post( '/account/reset/deposit' )
        .set( 'Authorization', `Bearer ${ token }` );

      expect( response.status ).toEqual( 200 );
      expect( response.body ).toHaveProperty( 'balance' );
      expect( response.body.balance ).toEqual( 0 );

    } );

  } );

} );


// // Define test cases for /deposit endpoint
// describe('POST /deposit', () => {
//   it('allows a buyer to deposit a valid coin and updates their deposit balance', async () => {
//     // Create a user with buyer role and initial deposit balance of 0
//     const user = await User.create({
//       username: 'buyer1',
//       password: 'password123',
//       deposit: 0,
//       role: 'buyer',
//     });

//     // Send a POST request to /deposit endpoint with valid coin amount
//     const res = await request(app)
//       .post('/deposit')
//       .set('Authorization', `Bearer ${user.generateAuthToken()}`)
//       .send({ coin: 10 });

//     // Expect response status to be 200 and deposit balance to be updated
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.deposit).toEqual(10);
//   });

//   it('does not allow a buyer to deposit an invalid coin and returns an error response', async () => {
//     // Create a user with buyer role and initial deposit balance of 0
//     const user = await User.create({
//       username: 'buyer1',
//       password: 'password123',
//       deposit: 0,
//       role: 'buyer',
//     });

//     // Send a POST request to /deposit endpoint with invalid coin amount
//     const res = await request(app)
//       .post('/deposit')
//       .set('Authorization', `Bearer ${user.generateAuthToken()}`)
//       .send({ coin: 25 });

//     // Expect response status to be 400 and error message to be returned
//     expect(res.statusCode).toEqual(400);
//     expect(res.body.message).toEqual('Invalid coin amount');
//   });

//   it('does not allow a seller to access the /deposit endpoint and returns an error response', async () => {
//     // Create a user with seller role and initial deposit balance of 0
//     const user = await User.create({
//       username: 'seller1',
//       password: 'password123',
//       deposit: 0,
//       role: 'seller',
//     });

//     // Send a POST request to /deposit endpoint with valid coin amount
//     const res = await request(app)
//       .post('/deposit')
//       .set('Authorization', `Bearer ${user.generateAuthToken()}`)
//       .send({ coin: 10 });

//     // Expect response status to be 401 and error message to be returned
//     expect(res.statusCode).toEqual(401);
//     expect(res.body.message).toEqual('Unauthorized');
//   });

//   it('returns the correct deposit balance for the user', async () => {
//     // Create a user with buyer role and initial deposit balance of 20
//     const user = await User.create({
//       username: 'buyer1',
//       password: 'password123',
//       deposit: 20,
//       role: 'buyer',
//     });

//     // Send a GET request to /deposit endpoint
//     const res = await request(app)
//       .get('/deposit')
//       .set('Authorization', `Bearer ${user.generateAuthToken()}`);

//     // Expect response status to be 200 and deposit balance to be returned
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.deposit).toEqual(20);
//   });
// });


// const request = require('supertest');
// const app = require('./app');

// describe('/deposit endpoint', () => {
//   it('allows a buyer to deposit a valid coin and returns updated deposit balance', async () => {
//     const response = await request(app)
//       .post('/deposit')
//       .send({ coin: 10 })
//       .set('Authorization', 'Bearer buyerToken');

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty('deposit', 10);
//   });

//   it('does not allow a buyer to deposit an invalid coin and returns an error response', async () => {
//     const response = await request(app)
//       .post('/deposit')
//       .send({ coin: 25 })
//       .set('Authorization', 'Bearer buyerToken');

//     expect(response.statusCode).toBe(400);
//     expect(response.body).toHaveProperty('error', 'Invalid coin');
//   });

//   it('does not allow a seller to access the endpoint and returns an error response', async () => {
//     const response = await request(app)
//       .post('/deposit')
//       .send({ coin: 10 })
//       .set('Authorization', 'Bearer sellerToken');

//     expect(response.statusCode).toBe(401);
//     expect(response.body).toHaveProperty('error', 'Unauthorized');
//   });
// });

// describe('/buy endpoint', () => {
//   it('allows a buyer to buy a product and returns the purchased product and any change owed', async () => {
//     const response = await request(app)
//       .post('/buy')
//       .send({ productId: '123', amount: 1 })
//       .set('Authorization', 'Bearer buyerToken');

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty('product', 'Soda');
//     expect(response.body).toHaveProperty('change', [50]);
//   });

//   it('does not allow a buyer to buy a product they cannot afford and returns an error response', async () => {
//     const response = await request(app)
//       .post('/buy')
//       .send({ productId: '123', amount: 2 })
//       .set('Authorization', 'Bearer buyerToken');

//     expect(response.statusCode).toBe(400);
//     expect(response.body).toHaveProperty('error', 'Insufficient funds');
//   });

//   it('does not allow a seller to access the endpoint and returns an error response', async () => {
//     const response = await request(app)
//       .post('/buy')
//       .send({ productId: '123', amount: 1 })
//       .set('Authorization', 'Bearer sellerToken');

//     expect(response.statusCode).toBe(401);
//     expect(response.body).toHaveProperty('error', 'Unauthorized');
//   });
// });

// describe('/user endpoint', () => {
//   it('allows a seller to create a new user and returns the new user information', async () => {
//     const response = await request(app)
//       .post('/user')
//       .send({ username: 'testuser', password: 'password', role: 'buyer' })
//       .set('Authorization', 'Bearer sellerToken');

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty('username', 'testuser');
//   });

//   it('allows a buyer to update their own information and returns the updated information', async () => {
//     const response = await request(app)
//       .put('/user')
//       .send({ deposit: 50 })
//       .set('Authorization', 'Bearer buyerToken');

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty('deposit', 50);
//   });
