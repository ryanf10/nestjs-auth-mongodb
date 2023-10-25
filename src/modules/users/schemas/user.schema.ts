import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<User>;
@Schema()
export class User {
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
