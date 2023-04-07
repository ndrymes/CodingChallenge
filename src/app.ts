/* eslint-disable valid-jsdoc */
import express, { Application, RequestHandler } from 'express';
import httpContext from 'express-http-context';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import RedisStore from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';

// Initialize client.
const redisClient = createClient();

redisClient.connect();

// Initialize store.
const redisStore = new RedisStore( {
  client: redisClient,
  prefix: 'myapp:',
} );

import { PORT } from 'src/configs/app';
import { errorHandler } from 'src/middlewares/handle-error-code';

import { init } from 'src/init';

/**
 * Setup the application routes with controllers
 * @param app
 */
async function setupRoutes( app: Application ){

  const { healthcheckController,
    rootController,
    userController,
    authController,
    productController,
    orderController,
    accountController,
  } = await init();

  app.use( '/healthcheck', healthcheckController.getRouter() );
  app.use( '/', rootController.getRouter() );
  app.use( '/auth', authController.getRouter() );
  app.use( '/user', userController.getRouter() );
  app.use( productController.getRouter() );
  app.use( '/account', accountController.getRouter() );
  app.use( orderController.getRouter() );


}

/**
 * Main function to setup Express application here
 */
export async function createApp(): Promise<express.Application>{

  const app = express();

  app.set( 'port', PORT );
  app.use( helmet() as RequestHandler );
  app.use( compression() );
  app.use( bodyParser.json( { limit: '5mb', type: 'application/json' } ) as RequestHandler );
  app.use( bodyParser.urlencoded( { extended: true } ) as RequestHandler );
  app.use( cors() );

  // Initialize sesssion storage.
  app.use(
    session( {
      store:             redisStore,
      resave:            false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret:            'keyboard cat',
    } )
  );

  // This should be last, right before routes are installed
  // so we can have access to context of all previously installed
  // middlewares inside our routes to be logged
  app.use( httpContext.middleware );

  await setupRoutes( app );

  // In order for errors from async controller methods to be thrown here,
  // you need to catch the errors in the controller and use `next(err)`.
  // See https://expressjs.com/en/guide/error-handling.html
  app.use( errorHandler() );

  return app;

}
