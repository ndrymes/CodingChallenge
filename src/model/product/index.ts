import { Schema } from 'mongoose';
import { IProduct } from 'src/types/types';

export const productSchema = new Schema<IProduct>( {
  productName: {
    type:     String,
    required: true,
    index:    true
  },
  amountAvailable: {
    type:     Number,
    required: true,
    min:      0,
    default:  0
  },
  cost: {
    type:     Number,
    required: true,
    min:      0,
    validate: {
      validator: ( v: number )=>v % 5 === 0,
      message:   'Cost must be in multiples of 5'
    }
  },
  sellerId: {
    type:     Schema.Types.ObjectId,
    ref:      'Seller',
    required: true,
    index:    true
  }
} );

productSchema.index( { sellerId: 1, productName: 1 } );

