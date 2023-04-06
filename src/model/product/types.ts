import { ObjectId } from 'mongoose';

interface IProduct {
    productName: string;
    amountAvailable: number;
    cost: number;
    sellerId: ObjectId;
}
