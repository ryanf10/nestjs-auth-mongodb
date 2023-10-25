import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type CatDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: string;

  @Prop({
    unique: true,
    uniqueCaseInsensitive: true,
  })
  email: string;

  @Prop({
    unique: true,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
