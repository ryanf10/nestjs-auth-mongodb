import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from '../../roles/schemas/role.schema';

export type UserDcoument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id: string;

  @Prop({
    unique: true,
    uniqueCaseInsensitive: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: () => 'asd' })
  refreshToken: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  @Prop({ type: mongoose.Schema.Types.Date })
  createdAt?: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User).set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.password;
    delete ret.refreshToken;
  },
});
