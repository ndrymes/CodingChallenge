/* eslint-disable no-useless-constructor */
/* eslint-disable no-restricted-syntax */
import { Model } from 'mongoose';
import { IUser } from 'src/model/user/types';
import { RoleType } from 'src/model/user/enums';


export interface CreateUserPayload {
  username: string;
  role:RoleType
  password: string;
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

    return this.model.findOne( { id: userId } );

  }

  public async findUser( username: string ): Promise<IUser>{

    const user = await this.model.findOne( { username } );

    return user;

  }

  public async deleteUser( existingUser: IUser ){

    return this.model.deleteOne( { id: existingUser.id } );

  }

}
