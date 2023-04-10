import { ObjectId } from 'mongoose';

export interface IProduct {
    id:string
    productName: string;
    amountAvailable: number;
    cost: number;
    sellerId: ObjectId;
}
