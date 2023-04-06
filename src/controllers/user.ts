import { NextFunction, Request, Response, Router } from 'express';
import { UserService } from 'src/services/user';

interface UserControllerOptions {
    userService: UserService;
}

export class UserController{

  private router: Router;

  // eslint-disable-next-line no-unused-vars
  constructor( private readonly options: UserControllerOptions ){

    this.router = Router();
    this.router.post( '/user', this.register.bind( this ) );
    this.router.post( '/login', this.login.bind( this ) );
    this.router.post( '/delete', this.delete.bind( this ) );

  }

  getRouter(): Router{

    return this.router;

  }

  public async register( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const registerResponse = await this.options.userService.register( req.body );

      return res.status( 201 ).json( registerResponse );

    } catch( error ){

      return next( error );

    }

  }

  public async login( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const loginResponse = await this.options.userService.login( {
        username: req.body.username,
        password: req.body.password
      } );

      return res.status( 202 ).json( loginResponse );

    } catch( error ){

      return next( error );

    }

  }

  public async delete( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const { userId } = req.params;

      const user = await this.options.userService.delete( userId );

      return res.status( 200 ).json( user );

    } catch( error ){

      return next( error );

    }

  }

}
