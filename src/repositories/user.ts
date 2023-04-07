/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-restricted-syntax */
import { Model } from 'mongoose';
import { IUser } from 'src/types/user';
import { RoleType } from 'src/model/user/enums';
import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export interface CreateUserPayload {
  username: string;
  role:RoleType
  password: string;
}

// I used deposit to mainatain the convention in the task, This field should be account
export interface AllowedUpdates {
  deposit?:string
}

export class UserRepository{

  // eslint-disable-next-line no-unused-vars
  constructor( private readonly model: Model<IUser> ){}

  public async createUser( user: CreateUserPayload ): Promise<IUser>{

    return this.model.create( user );

  }

  public async isUserExist( username: string ): Promise<boolean>{

    const userCount = await this.model.count(  { username }   );

    return userCount >= 1;

  }

  public async getUser( userId: string ): Promise<IUser>{

    return this.model.findOne( { _id: userId } );

  }

  public async findUser( username: string ): Promise<IUser>{

    const user = await this.model.findOne( { username } );

    return user;

  }

  public async updateUser( query: FilterQuery<IUser>, update: UpdateQuery<IUser>, options: QueryOptions ): Promise<IUser>{

    return this.model.findOneAndUpdate( query, update, options );

  }
  public async deleteUser( existingUser: IUser ){

    return this.model.deleteOne( { _id: existingUser.id } );

  }

}
