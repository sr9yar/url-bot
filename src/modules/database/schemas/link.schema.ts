import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type LinkDocument = Link & mongoose.Document;

@Schema({
  collection: 'links',
  timestamps: true,
})
export class Link {
  @Prop({ type: String, nullable: false, unique: true, index: true })
  shortCode: string;

  @Prop({ type: String, nullable: false })
  url: string;

  @Prop({ type: Number, nullable: false })
  chatId: number;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
