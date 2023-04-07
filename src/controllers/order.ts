/* eslint-disable id-blacklist */
import { Request, Response, Router, NextFunction } from 'express';

import { OrderService } from 'src/services/order';
import { handleTokenAuthorization } from 'src/middlewares/handle-Token-authorization';
import constants  from "src/constants";

const { ROLES : { BUYER }} = constants

interface OrderControllerOptions {
  orderService: OrderService;
}

export class OrderController{

  private router: Router;
  // eslint-disable-next-line no-unused-vars
  constructor( private readonly options: OrderControllerOptions ){

    this.router = Router();
    this.router.post( '/order', handleTokenAuthorization( BUYER ),  this.create.bind( this ) );

  }

  getRouter(): Router{

    return this.router;

  }

  public async create( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const { productId, amount }  = req.body;
      const { user } = res.locals

      const order  = await this.options.orderService.buyProduct( productId, amount, user.userId );

      return res.status( 200 ).json( order  );

    } catch( error ){

      return next( error );

    }

  }

}

