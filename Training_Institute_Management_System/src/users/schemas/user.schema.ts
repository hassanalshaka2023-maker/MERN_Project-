import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // قمنا بتحديد نوع الحقل هنا صراحة كـ String لتفادي هذا الاعتراض
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true, unique: true })
  email!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: String, required: true })
  role!: string; // Manager أو Professor أو Student
}

export const UserSchema = SchemaFactory.createForClass(User);
