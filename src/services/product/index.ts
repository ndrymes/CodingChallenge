/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */

import { ErrorCodes } from 'src/libs/errors';
import { StandardError } from 'src/libs/standard-error';
import { ProductRepository } from 'src/repositories/product';
import { CreateProductPayload } from './types';
import { IProduct } from 'src/types/types';
import { CreateUserPayload } from 'src/repositories/user';

interface ProductServiceOptions {
  productRepository: ProductRepository;
}

export class ProductService{

  constructor( private readonly options: ProductServiceOptions ){}

  public async create( productPaylod: CreateProductPayload ): Promise<IProduct>{

    return this.options.productRepository.createProduct( productPaylod );

  }

  public async get( productId:string ):Promise<IProduct>{

    return this.options.productRepository.getProduct( productId );

  }

  public async find():Promise<IProduct[]>{

    return this.options.productRepository.findProduct();

  }

  public async update( productId: string, userId:string, allowedUpdates:Omit< CreateUserPayload, 'sellerId'> ){

    const product = await this.options.productRepository.getProduct( productId );
    if( !product ) throw new StandardError( ErrorCodes.PRODUCT_NOT_FOUND, 'Product does not exist' );
    if( product.sellerId.toString() !== userId ) throw new StandardError( ErrorCodes.REQUEST_FORBIDDEN_ERROR, 'You are not authorized' );
    return this.options.productRepository.updateProduct(
      { _id: product.id },
      { $set: allowedUpdates },
      { new: true }
    );

  }

  public async delete( productId: string, userId:string ){

    const product = await this.options.productRepository.getProduct( productId );
    if( !product ) throw new StandardError( ErrorCodes.PRODUCT_NOT_FOUND, 'Product does not exist' );
    if( product.sellerId.toString() !== userId ) throw new StandardError( ErrorCodes.REQUEST_FORBIDDEN_ERROR, 'You are not authorized' );
    return this.options.productRepository.deleteProduct( product  );

  }

}
