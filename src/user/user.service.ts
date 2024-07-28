import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UserConstants } from './config/user.constants';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const { email } = createUserDto;

    if (!this.isValidEmail(email)) {
      return UserConstants.EMAIL_INVALID;
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      return UserConstants.USER_EXISTS(existingUser.id);
    }

    try {
      const user = new User();
      user.email = email;
      user.createdAt = new Date().toISOString();
      await this.userRepository.save(user);
      return UserConstants.USER_CREATED(user.id);
    } catch (error) {
      return UserConstants.ERROR_OCCURRED;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
