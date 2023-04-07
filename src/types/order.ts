import { ObjectId } from 'mongoose';

export interface IOrder {
    id:string
    productId: ObjectId;
    buyerId: ObjectId;
    cost: number;
    sellerId: ObjectId;
}
