import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto) {
    const course = await this.courseModel.create(createCourseDto);

    return {
      success: true,
      message: 'Course created successfully',
      data: course,
    };
  }

  async getAllCourses() {
    const courses = await this.courseModel.find();

    return {
      success: true,
      data: courses,
    };
  }

  async getCourseById(id: string) {
    const course = await this.courseModel.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      data: course,
    };
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseModel.findByIdAndUpdate(
      id,
      updateCourseDto,
      { new: true },
    );

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      message: 'Course updated successfully',
      data: course,
    };
  }

  async deleteCourse(id: string) {
    const course = await this.courseModel.findByIdAndDelete(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      message: 'Course deleted successfully',
    };
  }

  async getCoursesByProfessor(professorId: string) {
    const courses = await this.courseModel.find({ professorId });

    return {
      success: true,
      data: courses,
    };
  }
}
