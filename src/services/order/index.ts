/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { ErrorCodes } from 'src/libs/errors';
import { StandardError } from 'src/libs/standard-error';
import { AccountRepository } from 'src/repositories/account';
import { ProductRepository } from 'src/repositories/product';

interface OrderServiceOptions {
    accountRepository: AccountRepository;
    productRepository: ProductRepository;
}

interface Coin {
  value: number;
  count: number;
}

export class OrderService{

  constructor( private readonly options: OrderServiceOptions ){}

  public async buyProduct( productId: string, amount: number, userId: string ){

    const account = await this.options.accountRepository.getAccountByUserId( userId );
    const product = await this.options.productRepository.getProduct( productId );
    if( !product ) throw new StandardError( ErrorCodes.PRODUCT_NOT_FOUND, 'Product does not exist' );
    if( product.amountAvailable < amount   ) throw new StandardError( ErrorCodes.INSUFFICIENT_STOCK, 'Insufficient stock' );

    const totalCost = product.cost * amount; // since we can only purchasing one brand of product per time
    if( account.balance < totalCost ) throw new StandardError( ErrorCodes.NOT_ENOUGH_COINS, 'Not Enough Coins in your deposit' );

    const balance =  account.balance - totalCost;

    // update user balance
    await this.options.accountRepository.updateAccountByUserId(
      { userId },
      { $inc: { balance: -totalCost  } },
      { new: true }
    );

    // update Amount Available
    await this.options.productRepository.updateProduct(
      { userId },
      { $inc: { amountAvailable: -amount  } },
      { new: true }
    );


    return {
      change:     this.calculateChange(  balance  ),
      totalSpent: totalCost,
      product:    product.id
    };

  }

  private calculateChange( balance: number ){

    const coins: Coin[] = [];
    let remainingAmount = balance;

    const coinValues = [ 100, 50, 20, 10, 5 ];

    coinValues.forEach( value=>{

      const count = Math.floor( remainingAmount / value );
      if( count > 0 ){

        coins.push( { count, value } );
        remainingAmount %= value;

      }

    } );
    return coins;

  }

}
