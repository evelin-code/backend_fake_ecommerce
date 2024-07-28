import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entity/user';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserConstants } from './config/user.constants';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should return an error if email is invalid', async () => {
      const createUserDto: CreateUserDto = { email: 'invalid-email' };
      const result = await service.createUser(createUserDto);
      expect(result).toEqual(UserConstants.EMAIL_INVALID);
    });

    it('should return an error if user already exists', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com' };
      jest.spyOn(repository, 'findOne').mockResolvedValue({ id: 1 } as User);

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(UserConstants.USER_EXISTS(1));
    });

    it('should create a new user and return success', async () => {
      const createUserDto: CreateUserDto = { email: 'newuser@example.com' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue({ id: 1 } as User);

      const result = await service.createUser(createUserDto);
      const expected = UserConstants.USER_CREATED(1);

      expect(result).toEqual(expected);
    });

    it('should return an error if there is a problem saving the user', async () => {
      const createUserDto: CreateUserDto = { email: 'newuser@example.com' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Some error'));

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(UserConstants.ERROR_OCCURRED);
    });
  });
});