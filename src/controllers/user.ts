import { NextFunction, Request, Response, Router } from 'express';
import { UserService } from 'src/services/user';
import { handleTokenAuthorization } from 'src/middlewares/handle-Token-authorization';

interface UserControllerOptions {
    userService: UserService;
}

export class UserController{

  private router: Router;

  // eslint-disable-next-line no-unused-vars
  constructor( private readonly options: UserControllerOptions ){

    this.router = Router();
    this.router.post( '/delete', handleTokenAuthorization(), this.delete.bind( this ) );

  }

  getRouter(): Router{

    return this.router;

  }

  public async delete( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const { user:{ userId } } = res.locals;
      const response = await this.options.userService.delete( userId );

      return res.status( 200 ).json( response );

    } catch( error ){

      return next( error );

    }

  }

}
