import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  name!: string;

  @Prop()
  description!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  maxStudents!: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  professorId!: Types.ObjectId;

  @Prop({ required: true })
  day!: string;

  @Prop({ required: true })
  startDate!: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
