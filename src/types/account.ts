import { ObjectId } from 'mongoose';

export interface IAccount {
    id:string
    userId: ObjectId;
    balance: number;
}
