import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EnrollmentDocument = Enrollment & Document;

@Schema({ timestamps: true })
export class Enrollment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course_id!: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  enrollment_date!: Date;

  @Prop({ type: String, enum: ['active', 'completed', 'dropped', 'pending'], default: 'active' })
  status!: string;

  @Prop({ type: Date })
  attendance_date?: Date;

  @Prop({ type: String, enum: ['present', 'absent', 'pending'], default: 'pending' })
  attendance_status!: string;

  @Prop({ type: Number, min: 0, max: 100 })
  grade?: number;

  @Prop({ type: String })
  grade_note?: string;

  @Prop({ type: String, enum: ['Passed', 'Failed', 'Pending'], default: 'Pending' })
  result!: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
