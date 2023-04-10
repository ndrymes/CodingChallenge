/* eslint-disable id-blacklist */
import { Request, Response, Router, NextFunction } from 'express';

import { AccountService } from 'src/services/account';
import { handleTokenAuthorization } from 'src/middlewares/handle-token-authorization';

interface AccountControllerOptions {
  accountService: AccountService;
}

import CONSTANTS from 'src/constants';

const { ROLES: { BUYER } } = CONSTANTS;

export class AccountController{

  private router: Router;
  // eslint-disable-next-line no-unused-vars
  constructor( private readonly options: AccountControllerOptions ){

    this.router = Router();
    this.router.post( '/deposit', handleTokenAuthorization( BUYER ),  this.deposit.bind( this ) );
    this.router.post( '/reset/deposit', handleTokenAuthorization( BUYER ),  this.resetDeposit.bind( this ) );

  }

  getRouter(): Router{

    return this.router;

  }

  public async deposit( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const { amount }  = req.body;
      const { user } = res.locals

      const account  = await this.options.accountService.deposit( user.userId, amount );

      return res.status( 200 ).json( account  );

    } catch( error ){

      return next( error );

    }

  }

  public async resetDeposit( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const { user } = res.locals

      const account  = await this.options.accountService.resetDeposit( user.userId );

      return res.status( 200 ).json( account  );

    } catch( error ){

      return next( error );

    }

  }

}

