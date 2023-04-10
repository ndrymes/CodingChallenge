import mongoose from 'mongoose';
import { DB_URL, IS_LOCAL } from 'src/configs/app';
import { logger } from './libs/logger';
import { MongoMemoryServer } from 'mongodb-memory-server'

const getDatabaseUrl = async (): Promise<string> => new Promise(async (resolve, reject) => {
  try {
    if (process.env.NODE_ENV === 'test') {
      const mongo = await MongoMemoryServer.create();;
      const url = await mongo.getUri();
       resolve(url);
    }
    resolve(DB_URL);
  } catch (error) {
    reject(error);
  }
});

export async function connectDb(): Promise<void>{

  try{
    mongoose.set( 'debug', IS_LOCAL );
    const url = await getDatabaseUrl()

    await mongoose.connect(url, {
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
