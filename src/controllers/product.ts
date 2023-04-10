/* eslint-disable id-blacklist */
import { Request, Response, Router, NextFunction } from 'express';

import { ProductService } from 'src/services/product';
import { handleTokenAuthorization } from 'src/middlewares/handle-token-authorization';

interface ProductControllerOptions {
  productService: ProductService;
}

import CONSTANTS from 'src/constants';

const { ROLES: { SELLER } } = CONSTANTS;

export class ProductController{

  private router: Router;
  // eslint-disable-next-line no-unused-vars
  constructor( private readonly options: ProductControllerOptions ){

    this.router = Router();
    this.router.get( '/products', this.find.bind( this ) );
    this.router.get( '/products/:productId' , this.get.bind( this ) );
    this.router.put( '/products/:productId' , handleTokenAuthorization( SELLER ), this.update.bind( this ) );
    this.router.post( '/product', handleTokenAuthorization( SELLER ),  this.create.bind( this ) );
    this.router.delete( '/products/:productId', handleTokenAuthorization( SELLER ), this.delete.bind( this ) );

  }

  getRouter(): Router{

    return this.router;

  }

  public async create( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const { user:{ userId } } = res.locals;
      const productPaylod = {
        ...req.body,
        sellerId: userId
      };

      const product = await this.options.productService.create( productPaylod );
      return res.status( 200 ).json( product );

    } catch( error ){

      return next( error );

    }

  }

  public async find( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const products = await this.options.productService.find();

      return res.status( 200 ).json( products );

    } catch( error ){

      return next( error );

    }

  }

  public async get( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const { productId } = req.params;
      const product = await this.options.productService.get( productId );

      if( !product ) return res.status( 404 ).json( { error: 'Product not found' } );
      return res.status( 200 ).json( product );

    } catch( error ){

      return next( error );

    }

  }

  public async update( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{
      const { user:{ userId }} = res.locals
      const { productId } = req.params;

      const product = await this.options.productService.update( productId, userId, req.body );
      return res.status( 200 ).json( product );

    } catch( error ){

      return next( error );

    }

  }

  public async delete( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{
      const { user:{ userId }} = res.locals
      const { productId } = req.params;

      const product = await this.options.productService.delete( productId, userId );
      return res.status( 200 ).json( product );

    } catch( error ){

      return next( error );

    }

  }

}

