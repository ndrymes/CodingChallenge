import mongoose from 'mongoose';
import { DB_URL, IS_LOCAL } from 'src/configs/app';
import { logger } from './libs/logger';

export async function connectDb(): Promise<void>{

  try{

    mongoose.set( 'debug', IS_LOCAL );

    await mongoose.connect( DB_URL, {
      keepAlive:             true,
      keepAliveInitialDelay: 300000,
      autoIndex:             IS_LOCAL
    } );

    mongoose.connection.on( 'error', error=>{

      logger.error( error, 'Something went wrong with the connection after the first initialization' );

    } );

  } catch( error ){

    logger.error( error, 'Unable to connect to database' );
    throw error;

  }

}
