/* eslint-disable no-useless-constructor */
/* eslint-disable no-restricted-syntax */
import { Model } from 'mongoose';
import { IOrder } from 'src/types/order';

export class OrderRepository{

  // eslint-disable-next-line no-unused-vars
  constructor( private readonly model: Model<IOrder> ){}

  public async createOrder( orders: Omit< IOrder, 'id'  > ): Promise<IOrder>{

    return this.model.create( orders );

  }

  public async getOrder( ordersId: string ): Promise<IOrder>{

    return this.model.findOne( { id: ordersId } );

  }

}
