import { model } from 'mongoose';
import { connectDb } from 'src/db';
import { HealthcheckController } from 'src/controllers/healthcheck';
import { RootController } from 'src/controllers/root';
import { IUser } from 'src/model/user/types';
import { userSchema } from 'src/model/user/index';
import { UserService }  from 'src/services/user'
import { UserRepository } from "src/repositories/user";
import { UserController  } from "src/controllers/user";

/**
 * Initialize all ENV values and dependencies here so that they are re-usable across web servers, queue runners and crons
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function init(): Promise<Record<string, any>>{

  // models
  await connectDb();
  const userModel = model<IUser>('User', userSchema );

  // repositories
   const userRepository = new UserRepository(userModel);

   // services
  const userService = new UserService({
        userRepository,
    });

  // controllers
  const healthcheckController = new HealthcheckController();
  const rootController = new RootController();
  const userController = new UserController({ userService})

  return {
    healthcheckController,
    rootController,
    userController
    
  };

}
