import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { UsersService } from '../users/users.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly usersService: UsersService,
  ) {}

  private checkAuth(authHeader: string, allowedRoles: string[]) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('غير مسموح لك، يرجى إرسال الـ Token (JWT)');
    }
    const token = authHeader.split(' ')[1]; // تم الإصلاح هنا: استخراج التوكن كـ string نقي وصريح
    const decoded = this.usersService.verifyToken(token);
    if (!allowedRoles.includes(decoded.role)) {
      throw new UnauthorizedException(`هذا المسار مخصص للأدوار التالية فقط: ${allowedRoles.join(', ')}`);
    }
    return decoded;
  }

  @Post('register')
  async createEnrollment(@Body('studentId') studentId: string, @Body('courseId') courseId: string) {
    return this.enrollmentsService.createEnrollment(studentId, courseId);
  }

  @Get()
  async findAll() {
    return this.enrollmentsService.findAll();
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: any, @Headers('authorization') authHeader: string) {
    this.checkAuth(authHeader, ['Manager']); // محمي بتوكن المدير الحقيقي 🔒
    return this.enrollmentsService.updateStatus(id, updateStatusDto);
  }

  @Get('students/my-enrollments')
  async getMyEnrollments(@Headers('authorization') authHeader: string) {
    const decoded = this.checkAuth(authHeader, ['Student']);
    return this.enrollmentsService.getMyGrades(decoded.id);
  }

  @Get('courses/:courseId/students')
  async getStudentsByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.findByCourse(courseId);
  }

  @Get('attendance')
  async getAllAttendance() {
    return this.enrollmentsService.getAllAttendance();
  }

  @Get('courses/:courseId/attendance')
  async getAttendanceByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.getAttendanceByCourse(courseId);
  }

  @Get('students/my-attendance')
  async getMyAttendance(@Headers('authorization') authHeader: string) {
    const decoded = this.checkAuth(authHeader, ['Student']);
    return this.enrollmentsService.getMyAttendance(decoded.id);
  }

  @Post('grades')
  async createGrade(@Query('id') id: string, @Body() updateGradeDto: any, @Headers('authorization') authHeader: string) {
    this.checkAuth(authHeader, ['Professor']);
    return this.enrollmentsService.updateGrade(id, updateGradeDto);
  }

  @Get('grades')
  async getAllGrades() {
    return this.enrollmentsService.getAllGrades();
  }

  @Get('courses/:courseId/grades')
  async getGradesByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.getGradesByCourse(courseId);
  }

  @Get('students/my-grades')
  async getMyGrades(@Headers('authorization') authHeader: string) {
    const decoded = this.checkAuth(authHeader, ['Student']);
    return this.enrollmentsService.getMyGrades(decoded.id);
  }

  @Get('students/my-results')
  async getMyResults(@Headers('authorization') authHeader: string) {
    const decoded = this.checkAuth(authHeader, ['Student']);
    return this.enrollmentsService.getMyResults(decoded.id);
  }

  @Get('courses/:courseId/results')
  async getResultsByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.getResultsByCourse(courseId);
  }

  @Get('analytics/course/:courseId')
  async getCourseAnalytics(@Param('courseId') courseId: string, @Headers('authorization') authHeader: string) {
    this.checkAuth(authHeader, ['Manager', 'Professor']);
    return this.enrollmentsService.getCourseAnalytics(courseId);
  }

  @Get('analytics/institute')
  async getInstituteAnalytics(@Headers('authorization') authHeader: string) {
    this.checkAuth(authHeader, ['Manager']);
    return this.enrollmentsService.getGeneralInstituteAnalytics();
  }

  @Get('attendance/:id')
  async getAttendanceById(@Param('id') id: string) {
    return this.enrollmentsService.getAttendanceById(id);
  }

  @Put('attendance/:id')
  async updateAttendance(@Param('id') id: string, @Body() updateAttendanceDto: any, @Headers('authorization') authHeader: string) {
    this.checkAuth(authHeader, ['Professor']);
    return this.enrollmentsService.updateAttendance(id, updateAttendanceDto);
  }

  @Delete('attendance/:id')
  async deleteAttendance(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    this.checkAuth(authHeader, ['Professor']);
    return this.enrollmentsService.deleteAttendance(id);
  }

  @Get('grades/:id')
  async getGradeById(@Param('id') id: string) {
    return this.enrollmentsService.getGradeById(id);
  }

  @Put('grades/:id')
  async updateGrade(@Param('id') id: string, @Body() updateGradeDto: any, @Headers('authorization') authHeader: string) {
    this.checkAuth(authHeader, ['Professor']);
    return this.enrollmentsService.updateGrade(id, updateGradeDto);
  }

  @Delete('grades/:id')
  async deleteGrade(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    this.checkAuth(authHeader, ['Professor']);
    return this.enrollmentsService.deleteGrade(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(id);
  }
}
