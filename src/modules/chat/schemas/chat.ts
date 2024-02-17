import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user-management/schemas/user.schema';

export type ChatDocument = HydratedDocument<Chat>;
@Schema({ timestamps: true })
export class Chat {
  @Prop({
    type: mongoose.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user1: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user2: User;

  @Prop()
  lastMessage: string;

  @Prop({ type: mongoose.Schema.Types.Date })
  lastMessageAt: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  createdAt?: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  updatedAt?: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat).set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
