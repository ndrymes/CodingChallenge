/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import { ErrorCodes } from 'src/libs/errors';
import { StandardError } from 'src/libs/standard-error';
import { UserRepository } from 'src/repositories/user';
import { AccountRepository } from 'src/repositories/account';

interface AccountServiceOptions {
  accountRepository: AccountRepository;
  userRepository: UserRepository;
}

export class AccountService{

  constructor( private readonly options: AccountServiceOptions ){}

  public async create( userId: string ){

    return this.options.accountRepository.createAccount( userId );

  }

  public async deposit( userId: string, coin: number ){

    const allowedCoins = [ 5, 10, 20, 50, 100 ];
    if( !allowedCoins.includes( coin ) ) throw new StandardError( ErrorCodes.BAD_REQUEST, 'Coins should be multiples of 5' );
    return this.options.accountRepository.updateAccountByUserId( { userId }, { $inc: { balance: coin } },  { new: true } );

  }

  public async resetDeposit( userId: string ){

    return this.options.accountRepository.updateAccountByUserId( { userId }, { $set: { balance: 0 } },  { new: true } );

  }

}
