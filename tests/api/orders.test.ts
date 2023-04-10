/* eslint-disable no-undef */
import { createApp } from 'src/app';
import request from 'supertest';

describe( '/order', ()=>{

  let app: Express.Application;
  let buyerToken: string;
  let sellerToken: string;
  let productId:string;

  beforeAll( async()=>{

    app = await createApp();
    // create a buyer
    const response = await request( app )
      .post( '/auth/register' )
      .send( {
        username: 'buyer@mail.com',
        password: 'testpassword',
        role:     'BUYER'
      } );

    buyerToken = response.body.token;

  } );

  describe( 'POST order/buy', ()=>{

    // describe('/user endpoint', () => {
    test( 'allows a seller to create a new user and returns the new user information', async()=>{

      const response = await request( app )
        .post( '/auth/register' )
        .send( {
          username: 'seller@mail.com',
          password: 'testpassword',
          role:     'SELLER'
        } );
      sellerToken = response.body.token;

      expect( response.statusCode ).toBe( 201 );
      expect( response.body ).toHaveProperty( 'username', 'seller@mail.com' );
      expect( response.body ).toHaveProperty( 'role', 'SELLER' );

    } );

    test('user should be able to deposit', async () => {

      const response = await request(app)
        .post('/account/deposit')
        .set('Authorization', `Bearer ${ buyerToken }`)
        .send({
          amount: 100
        });

      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('balance');
      expect(response.body.balance).toEqual(100);

    });

    test('seller should be able to create a product', async () => {

      const response = await request(app)
        .post('/product')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
         productName: "productName",
         amountAvailable: 10,
         cost: 100
});

      productId = response.body._id

      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('productName');
      expect(response.body).toHaveProperty('sellerId');

    });

    test( 'throw an error if user does not supply auth token', async()=>{

      const res = await request( app )
        .post( '/order/buy' )
        .send( {
          productId,
          amount: 1
        } );

      expect( res.status ).toEqual( 401 );

    } );

    test('throw an error if your role is not a buyer role', async () => {

      const res = await request(app)
        .post('/order/buy')
        .set('Authorization', `Bearer ${ sellerToken }`)
        .send({
          productId,
          amount: 1
        });

      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual('Could not authorize request');

    });

    test( 'throw an error if product does not exist', async()=>{

      const res = await request( app )
        .post( '/order/buy' )
        .set('Authorization', `Bearer ${buyerToken}`)
        .send( {
          productId:"6433f12f2376b01546738cd7",
          amount:    1
        } );

      expect( res.status ).toEqual( 404 );
      expect( res.body.message ).toEqual( 'Product does not exist' );

    } );

    test( 'throw an error if amount of product available is less than amount to be purchased', async()=>{

      const res = await request( app )
        .post( '/order/buy' )
        .set('Authorization', `Bearer ${buyerToken}`)
        .send( {
          productId,
          amount: 12
        } );

      expect( res.status ).toEqual( 400 );
      expect( res.body.message ).toEqual( 'Insufficient stock' );

    } );

    test('should purchase product succesfully', async () => {

      const res = await request(app)
        .post('/order/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          productId,
          amount: 1
        });
       
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('change');
      expect(res.body).toHaveProperty('totalSpent');
      expect(res.body).toHaveProperty('product');

    });

    test( 'should throw error is user account balance is less than total cost of product', async()=>{

      const res = await request( app )
        .post( '/order/buy' )
        .set( 'Authorization', `Bearer ${ buyerToken }` )
        .send( {
          productId,
          amount: 2
        } );

      expect( res.status ).toEqual( 400 );
      expect( res.body.message ).toEqual( 'Not Enough Coins in your deposit' );

    } );

  } );

} );
