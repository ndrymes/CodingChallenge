import {  RoleType } from './enums';

export interface IUser {
    id: string;
    username: string;
    password: string;
    deposit: number;
    role: RoleType;
}
