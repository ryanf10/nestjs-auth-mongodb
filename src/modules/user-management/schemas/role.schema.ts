import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;
@Schema()
export class Role {
  @Prop({
    type: mongoose.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id: string;

  @Prop({
    unique: true,
    uniqueCaseInsensitive: true,
  })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role).set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
