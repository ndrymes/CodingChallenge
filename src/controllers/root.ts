import { Request, Response } from 'express';
import { BaseController } from './base';

export class RootController extends BaseController{

  constructor(){

    super();
    this.router.get( '/', RootController.index );

  }

  static index( _: Request, res: Response ): Response{

    return res.status( 200 ).json( { message: 'Application is running here!' } );

  }

}
