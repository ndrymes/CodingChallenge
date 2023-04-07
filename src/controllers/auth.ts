import { NextFunction, Request, Response, Router } from 'express';
import { AuthService } from 'src/services/auth';
import { AccountService  } from 'src/services/account';
import { UserService } from 'src/services/user';

interface AuthControllerOptions {
    authService: AuthService;
    accountService: AccountService
    userService: UserService
}

export class AuthController{

  private router: Router;

  // eslint-disable-next-line no-unused-vars
  constructor( private readonly options: AuthControllerOptions ){

    this.router = Router();
    this.router.post( '/user', this.register.bind( this ) );
    this.router.post( '/login', this.login.bind( this ) );

  }

  getRouter(): Router{

    return this.router;

  }

  public async register( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      // register user
      const user = await this.options.authService.register( req.body );
      // create account for user
      const account = await this.options.accountService.create( user.id );

      // update user with account details
      await this.options.userService.update( user.id, account.id );
      return res.status( 201 ).json( user );

    } catch( error ){

      return next( error );

    }

  }

  public async login( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const loginResponse = await this.options.authService.login( req.body, req.session );

      return res.status( 202 ).json( loginResponse );

    } catch( error ){

      return next( error );

    }

  }

}
