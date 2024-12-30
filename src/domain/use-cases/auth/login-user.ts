import { JwtAdapter } from '../../../config';
import { LoginUserDto } from '../../dtos';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
import { CustomError } from '../../errors';
import { UserToken } from '../../interfaces';
import { AuthRepository } from '../../repositories/auth.repository';

interface LoginUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class LoginUser implements LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken,
  ) {
    this.authRepository = authRepository;
  }

  async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
    const user = await this.authRepository.login(loginUserDto);

    const token = await this.signToken({ id: user.id });

    if (!token) throw CustomError.internalServer('Failed to generate token');

    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
