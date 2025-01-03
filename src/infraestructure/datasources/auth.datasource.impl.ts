import { BcryptAdapter, LoggerMethods } from '../../config';
import { UserModel } from '../../data/mongodb';
import {
  AuthDataSource,
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from '../../domain';
import { UserMapper } from '../mappers/user.mapper';

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashedPassword: string) => boolean;

export class AuthDataSourceImpl implements AuthDataSource {
  private readonly logger: LoggerMethods;
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
    buildLogger: (service?: string) => LoggerMethods,
  ) {
    this.logger = buildLogger('auth.datasource.impl.ts');
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;
    try {
      const exists = await UserModel.findOne({ email: email });
      if (exists) {
        throw CustomError.badRequest('User already exists');
      }

      const user = await UserModel.create({
        name: name,
        email: email,
        password: this.hashPassword(password),
      });

      await user.save();

      return UserMapper.fromUserObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        this.logger.error(
          `Error registering user: \n error: ${error.message} \n stack: ${error.stack}`,
        );
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        throw CustomError.badRequest('User not found');
      }

      const isMatching = this.comparePassword(password, user.password);
      if (!isMatching) {
        throw CustomError.badRequest('Invalid password');
      }

      return UserMapper.fromUserObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        this.logger.error('Error logging in user:', {
          error: error.message,
          stack: error.stack,
          email: email, // Log relevant context without sensitive data
        });
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
