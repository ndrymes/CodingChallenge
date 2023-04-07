import { Schema } from 'mongoose';
import { IAccount } from 'src/types/account';

export const accountSchema = new Schema<IAccount>( {
  balance: {
    type:     Number,
    required: true,
    min:      0,
    default:  0
  },
  userId: {
    type:     Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    index:    true
  }
} );

accountSchema.index( { userId: 1 } );

