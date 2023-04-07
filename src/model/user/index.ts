import { Schema } from 'mongoose';
import { RoleType } from './enums';
import { IUser } from 'src/types/user';

export const userSchema = new Schema<IUser>( {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: Object.values( RoleType ), required: true },
  deposit:  {
    type: Schema.Types.ObjectId,
    ref:  'Account',
  }
} );

userSchema.index( { username: 1 }, { unique: true } );
