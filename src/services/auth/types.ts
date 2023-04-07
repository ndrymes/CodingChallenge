import { RoleType } from 'src/model/user/enums';

export interface RegisterPayload {
    username: string;
    role:RoleType
    password: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    id: string;
    username:string
    token: string;
    role:RoleType
}

export interface RegisterResponse {
    id: string;
    username:string
    token:string
    role:RoleType
}

export interface UpdateUserPayload {
    id: string;
    username:string
    token:string
}
