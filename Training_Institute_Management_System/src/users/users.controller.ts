import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UnauthorizedException,
  Headers,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('login')
  login(@Body() loginDto: any) {
    return this.usersService.login(loginDto);
  }

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthorizedException(
        'No entry allowed, please send the managers token',
      );
    }
    const token = authHeader.split(' ')[1];
    const decodedUser = this.usersService.verifyToken(token);
    if (decodedUser.role !== 'Manager') {
      throw new UnauthorizedException(
        'The authority to create students and professors is limited to the director only!',
      );
    }
    return this.usersService.create(createUserDto);
  }

  @Get('students')
  findStudents() {
    return this.usersService.findAllStudents();
  }

  @Get('professors')
  findProfessors() {
    return this.usersService.findAllProfessors();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // @Get('profile')
  // getProfile() {
  //   return { message: 'هذا الرابط مخصص لعرض الملف الشخصي لاحقاً عند ربط نظام تسجيل الدخول الحقيقي' };
  // }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
