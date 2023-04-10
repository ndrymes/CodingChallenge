import { model } from 'mongoose';
import { connectDb } from 'src/db';
import { HealthcheckController } from 'src/controllers/healthcheck';
import { RootController } from 'src/controllers/root';

import { IUser } from 'src/types/user';
import { IProduct } from "src/types/product";
import { IAccount } from "src/types/account";
import { IOrder } from "src/types/order";

import { userSchema } from 'src/model/user';
import { accountSchema } from 'src/model/account';
import { productSchema } from 'src/model/product';
import { orderSchema } from "src/model/order/";

import { UserService }  from 'src/services/user'
import { AuthService }  from 'src/services/auth'
import { ProductService }  from 'src/services/product'
import { OrderService }  from 'src/services/order'
import { AccountService } from 'src/services/account';

import { UserRepository } from "src/repositories/user";
import { ProductRepository } from 'src/repositories/product';
import { AccountRepository } from "src/repositories/account";
import { OrderRepository } from "src/repositories/order";

import { UserController  } from "src/controllers/user";
import { AuthController } from 'src/controllers/auth';
import { ProductController } from 'src/controllers/product';
import { OrderController } from 'src/controllers/order'
import { AccountController } from 'src/controllers/account'

/**
 * Initialize all ENV values and dependencies here so that they are re-usable across web servers, queue runners and crons
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function init(): Promise<Record<string, any>>{

  // models
  await connectDb();
  const userModel = model<IUser>('User', userSchema );
  const productModel = model < IProduct> ('Product', productSchema )
  const accountModel = model < IAccount> ('account', accountSchema )
  const orderModel = model < IOrder> ('order', orderSchema )

  // repositories
   const userRepository = new UserRepository(userModel);
   const productRepository = new ProductRepository(productModel)
   const accountRepository = new AccountRepository( accountModel)

   // services
  const userService = new UserService({
        userRepository,
        productRepository
    });
  const authService = new AuthService({ userRepository })
  const accountService = new AccountService({ accountRepository, userRepository })
  const productService = new ProductService({ productRepository })
  const orderService = new OrderService ( { accountRepository, productRepository})

  // controllers
  const healthcheckController = new HealthcheckController();
  const rootController = new RootController();
  const userController = new UserController({ userService})
  const productController = new ProductController({ productService })
  const authController = new AuthController({ authService, accountService, userService })
  const orderController = new OrderController( { orderService })
  const accountController = new AccountController( { accountService })

  return {
    healthcheckController,
    rootController,
    userController,
    authController,
    productController,
    orderController,
    accountController
  };

}
