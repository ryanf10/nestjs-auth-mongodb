import { UsersService } from './users.service';
import { RolesService } from './roles.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../schemas/role.schema';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Model } from 'mongoose';

describe('UserService', () => {
  let service: UsersService;
  let rolesService: RolesService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;
  let userModelMock: Model<User>;

  const mockModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        RolesService,
        JwtService,
        { provide: getModelToken(User.name), useValue: mockModel },
        { provide: getModelToken(Role.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    rolesService = module.get<RolesService>(RolesService);
    jwtService = module.get<JwtService>(JwtService);
    userModelMock = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };

      const mockRole = { _id: 'someid', name: 'user' };
      jest.spyOn(rolesService, 'getRoleByName').mockResolvedValue(mockRole);

      const hashedPassword =
        '$2b$10$IzMc6QSd2ocNtvw.ZuEBNewBp1jUwgw0pPYtIfb8rUkLRHIermbDu';
      jest.spyOn(service, 'hash').mockResolvedValue(hashedPassword);

      const createdUser = {
        ...createUserDto,
        password: hashedPassword,
        roles: [mockRole],
      };
      mockModel.create.mockResolvedValue(createdUser as any);

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(mockModel.create).toHaveBeenCalledWith({
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword,
        roles: [mockRole],
      });
    });

    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const mockUser = {
        _id: 'userid123',
        username: 'testuser',
        email: 'test@example.com',
        password:
          '$2b$10$IzMc6QSd2ocNtvw.ZuEBNewBp1jUwgw0pPYtIfb8rUkLRHIermbDu',
        roles: [{ _id: 'someid', name: 'user' }],
      };
      jest.spyOn(userModelMock, 'findOne').mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      } as any);
      const result = await service.findOneByEmail(email);
      expect(result).toEqual(mockUser);
      expect(userModelMock.findOne).toHaveBeenCalledWith({ email });
    });

    it('should return null when user is not found', async () => {
      const email = 'random123@example.com';

      jest.spyOn(userModelMock, 'findOne').mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);
      const result = await service.findOneByEmail(email);
      expect(result).toEqual(null);
      expect(userModelMock.findOne).toHaveBeenCalledWith({ email });
    });
  });
});
