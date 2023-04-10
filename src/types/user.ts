import { ObjectId } from 'mongoose';
import {  RoleType } from 'src/model/user/enums';

export interface IUser {
    id: string;
    username: string;
    password: string;
    deposit?: ObjectId;
    role: RoleType;
}
