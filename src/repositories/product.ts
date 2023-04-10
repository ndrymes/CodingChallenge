/* eslint-disable max-len */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-restricted-syntax */
import { Model } from 'mongoose';
import { IProduct } from 'src/types/product';
import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export interface CreateProductPayload {
  productName: string;
  cost:number
  sellerId: string;
  amountAvailable: number
}

export class ProductRepository{

  // eslint-disable-next-line no-unused-vars
  constructor( private readonly model: Model<IProduct> ){}

  public async createProduct( product: CreateProductPayload ): Promise<IProduct>{

    return this.model.create( product );

  }

  public async getProduct( productId: string ): Promise<IProduct>{


    return this.model.findOne( { _id: productId } );

  }

  public async updateProduct( query: FilterQuery<IProduct>, update: UpdateQuery<IProduct>, options: QueryOptions ): Promise<IProduct>{

    return this.model.findOneAndUpdate( query, update, options );

  }

  public async findProduct(): Promise<IProduct[]>{

    const user = await this.model.find();

    return user;

  }

  public async deleteProduct( product: IProduct ){

    return this.model.deleteOne( { _id: product.id } );

  }

}
