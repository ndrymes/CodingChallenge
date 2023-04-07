import { Schema } from 'mongoose';
import { IOrder } from 'src/types/order';

export const orderSchema = new Schema<IOrder >( {
  productId: {
    type:     Schema.Types.ObjectId,
    required: true,
    index:    true
  },
  buyerId: {
    type:     Schema.Types.ObjectId,
    ref:      'User',
    required: true,
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
    ref:      'User',
    required: true,
    index:    true
  }
} );
