import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly MANAGER_CREDENTIALS = {
    id: 'manager-static-id',
    name: 'Manager_Hassan',
    email: 'Hassan@gmail.com',
    password: '12345678',
    role: 'Manager',
  };

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: any) {
    const { email, password } = loginDto;

    if (email === this.MANAGER_CREDENTIALS.email) {
      if (password === this.MANAGER_CREDENTIALS.password) {
        const payload = {
          id: this.MANAGER_CREDENTIALS.id,
          role: this.MANAGER_CREDENTIALS.role,
        };
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            name: this.MANAGER_CREDENTIALS.name,
            email: this.MANAGER_CREDENTIALS.email,
            role: this.MANAGER_CREDENTIALS.role,
          },
        };
      } else {
        throw new UnauthorizedException('the Password is admin not accpted');
      }
    }

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('the email is not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('the Password  not accpted');

    const payload = { id: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, role } = createUserDto;
    if ( email !== 'Hassan@gmail.com' )
    {
      if ( role === 'Professor' || role === 'Student' )
      {
        const userExists = await this.userModel.findOne( { email } ).exec();
        if ( userExists )
          throw new ConflictException( 'This email address is already registered' );

        const salt = await bcrypt.genSalt( 10 );
        const hashedPassword = await bcrypt.hash( password, salt );

        const newUser = new this.userModel( {
          ...createUserDto,
          password: hashedPassword,
        } );
        return await newUser.save();
      }
    } else
  {
    throw new ConflictException(
      'An additional manager account cannot be created via this link',
    );
  }
  }

  async findAllStudents() {
    return await this.userModel.find({ role: 'Student' }).exec();
  }
  async findAllProfessors() {
    return await this.userModel.find({ role: 'Professor' }).exec();
  }
  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(' The User is Not found ');
    return user;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const salt = await bcrypt.genSalt(10);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }
  async remove(id: string) {
    await this.userModel.findByIdAndDelete(id).exec();
    return { message: 'ok Delete Accpted' };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('The token is expired or invalid.');
    }
  }
}
