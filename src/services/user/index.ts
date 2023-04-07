/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import { ErrorCodes } from 'src/libs/errors';
import { StandardError } from 'src/libs/standard-error';
import { UserRepository } from 'src/repositories/user';
import { ProductRepository } from 'src/repositories/product';

interface UserServiceOptions {
    userRepository: UserRepository;
    productRepository: ProductRepository;
}

export class UserService{

  constructor( private readonly options: UserServiceOptions ){}

  public async delete( userId: string ){

    const existinguser = await this.options.userRepository.getUser( userId );
    if( !existinguser ) throw new StandardError( ErrorCodes.USER_NOT_FOUND, 'User does not exist' );
    return this.options.userRepository.deleteUser( existinguser );

  }

  public async update( userId: string , deposit: string ){

    const existinguser = await this.options.userRepository.getUser( userId );
    if( !existinguser ) throw new StandardError( ErrorCodes.USER_NOT_FOUND, 'User does not exist' );
    return this.options.userRepository.updateUser(
      { userId },
      { $set: { deposit  } },
      { new: true }
    );

  }

}
