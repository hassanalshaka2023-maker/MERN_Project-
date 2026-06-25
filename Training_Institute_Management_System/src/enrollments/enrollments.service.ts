import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';


@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async createEnrollment(studentId: string, courseId: string) {
    if (!Types.ObjectId.isValid(studentId) || !Types.ObjectId.isValid(courseId)) {
      throw new NotFoundException('معرّف الطالب أو معرّف الكورس غير صالح');
    }
    const newEnrollment = new this.enrollmentModel({
      student_id: new Types.ObjectId(studentId),
      course_id: new Types.ObjectId(courseId),
      status: 'pending',
      attendance_status: 'pending',
      result: 'Pending'
    });
    return await newEnrollment.save();
  }

  async findAll() {
    return await this.enrollmentModel.find().exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('الـ ID غير صالح');
    const record = await this.enrollmentModel.findById(id).exec();
    if (!record) throw new NotFoundException('سجل التسجيل غير موجود');
    return record;
  }

  async updateStatus(id: string, updateStatusDto: any) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('الـ ID غير صالح');
    const updated = await this.enrollmentModel.findByIdAndUpdate(
      id,
      { status: updateStatusDto.status },
      { new: true }
    ).exec();
    if (!updated) throw new NotFoundException('سجل التسجيل غير موجود لتعديله');
    return updated;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('الـ ID غير صالح');
    const deleted = await this.enrollmentModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('سجل التسجيل غير موجود لحذفه');
    return { message: 'تم إلغاء وحذف سجل التسجيل بنجاح' };
  }

  async findByCourse(courseId: string) {
    if (!Types.ObjectId.isValid(courseId)) throw new NotFoundException('الـ ID غير صالح');
    return await this.enrollmentModel.find({ course_id: new Types.ObjectId(courseId) }).exec();
  }

  async getAllAttendance() {
    return this.enrollmentModel.find({}, 'student_id course_id attendance_date attendance_status').exec();
  }

  async getAttendanceById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('الـ ID غير صالح');
    const record = await this.enrollmentModel.findById(id, 'student_id course_id attendance_date attendance_status').exec();
    if (!record) throw new NotFoundException('سجل الحضور غير موجود');
    return record;
  }

  async updateAttendance(id: string, updateAttendanceDto: any) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('الـ ID غير صالح');
    const updated = await this.enrollmentModel.findByIdAndUpdate(
      id,
      {
        attendance_date: new Date(updateAttendanceDto.attendance_date),
        attendance_status: updateAttendanceDto.attendance_status,
      },
      { new: true }
    ).exec();
    if (!updated) throw new NotFoundException('سجل التسجيل هذا غير موجود');
    return updated;
  }

  async deleteAttendance(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('الـ ID غير صالح');
    const record = await this.enrollmentModel.findByIdAndUpdate(id, { attendance_date: null, attendance_status: 'pending' }, { new: true }).exec();
    if (!record) throw new NotFoundException('سجل الحضور غير موجود');
    return { message: 'تم حذف بيانات الحضور بنجاح' };
  }

  getAttendanceByCourse(courseId: string) {
    return this.enrollmentModel.find({ course_id: new Types.ObjectId(courseId) }, 'student_id attendance_date attendance_status').exec();
  }

  getMyAttendance(studentId: string) {
    return this.enrollmentModel.find({ student_id: new Types.ObjectId(studentId) }, 'course_id attendance_date attendance_status').exec();
  }

  async updateGrade(id: string, updateGradeDto: any) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('الـ ID المرسل غير صالح');

    // الحساب البرمجي الآمن الفوري للنتيجة لتفادي أخطاء الـ Hook الـ 500 نهائياً
    const calculatedResult = updateGradeDto.grade >= 60 ? 'Passed' : 'Failed';

    const updatedRecord = await this.enrollmentModel.findByIdAndUpdate(
      id,
      {
        grade: updateGradeDto.grade,
        grade_note: updateGradeDto.grade_note || null,
        result: calculatedResult // حفظ النتيجة مباشرة في قاعدة البيانات الحقيقية
      },
      { new: true } // إرجاع المستند بعد التحديث لرؤية النتيجة فوراً
    ).exec();

    if (!updatedRecord) throw new NotFoundException('سجل الطالب غير موجود لرصد العلامة');
    return updatedRecord;
  }


  getAllGrades() {
    return this.enrollmentModel.find({}, 'student_id course_id grade grade_note result').exec();
  }

  async getGradeById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('الـ ID غير صالح');
    const record = await this.enrollmentModel.findById(id, 'student_id course_id grade grade_note result').exec();
    if (!record) throw new NotFoundException('سجل الدرجة غير موجود');
    return record;
  }

  async deleteGrade(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('الـ ID غير صالح');
    const record = await this.enrollmentModel.findByIdAndUpdate(id, { grade: null, grade_note: null, result: 'Pending' }, { new: true }).exec();
    if (!record) throw new NotFoundException('السجل غير موجود');
    return { message: 'تم حذف الدرجة بنجاح' };
  }

  getGradesByCourse(courseId: string) {
    return this.enrollmentModel.find({ course_id: new Types.ObjectId(courseId) }, 'student_id grade grade_note result').exec();
  }

  getMyGrades(studentId: string) {
    return this.enrollmentModel.find({ student_id: new Types.ObjectId(studentId) }, 'course_id grade grade_note result').exec();
  }

  getMyResults(studentId: string) {
    return this.enrollmentModel.find({ student_id: new Types.ObjectId(studentId) }, 'course_id result').exec();
  }

  getResultsByCourse(courseId: string) {
    return this.enrollmentModel.find({ course_id: new Types.ObjectId(courseId) }, 'student_id result').exec();
  }

  async getCourseAnalytics(courseId: string) {
    const records = await this.enrollmentModel.find({ course_id: new Types.ObjectId(courseId) }).exec();
    if (records.length === 0) return { totalStudents: 0, successRate: '0%', averageGrade: 0, attendanceRate: '100%' };
    let totalStudents = records.length, passedStudents = 0, totalGrades = 0, gradedCount = 0, presentCount = 0, attendanceCheckedCount = 0;
    records.forEach(record => {
      if (record.result === 'Passed') passedStudents++;
      if (record.grade !== null && record.grade !== undefined) { totalGrades += record.grade; gradedCount++; }
      if (record.attendance_status === 'present' || record.attendance_status === 'absent') {
        attendanceCheckedCount++;
        if (record.attendance_status === 'present') presentCount++;
      }
    });
    return {
      totalStudents,
      successRate: `${Math.round((passedStudents / totalStudents) * 100)}%`,
      averageGrade: gradedCount > 0 ? Math.round(totalGrades / gradedCount) : 0,
      attendanceRate: attendanceCheckedCount > 0 ? `${Math.round((presentCount / attendanceCheckedCount) * 100)}%` : '100%'
    };
  }

  async getGeneralInstituteAnalytics() {
    const allRecords = await this.enrollmentModel.find().exec();
    let totalEnrollments = allRecords.length;
    let totalPassed = allRecords.filter(r => r.result === 'Passed').length;
    return { totalEnrollments, instituteSuccessRate: totalEnrollments > 0 ? `${Math.round((totalPassed / totalEnrollments) * 100)}%` : '0%' };
  }
}
