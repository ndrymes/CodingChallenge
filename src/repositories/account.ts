/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-restricted-syntax */
import { Model } from 'mongoose';
import { IAccount } from 'src/types/account';
import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
export class AccountRepository{

  // eslint-disable-next-line no-unused-vars
  constructor( private readonly model: Model<IAccount> ){}

  public async createAccount( userId: string ): Promise<IAccount>{

    const account = {
      userId,
      balance: 0
    };

    return this.model.create( account );

  }

  public async getAccountByUserId( userId: string ): Promise<IAccount>{

    return this.model.findOne( { userId } );

  }


  public async updateAccountByUserId( query: FilterQuery<IAccount>, update: UpdateQuery<IAccount>, options: QueryOptions ): Promise<IAccount>{

    return this.model.findOneAndUpdate( query, update, options );

  }

}
