import { AuthDataSource, CustomError, RegisterUserDto, UserEntity } from "../../domain";

export class AuthDataSourceImpl implements AuthDataSource {
  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;
    try {
      return new UserEntity("1", name, email, password, ["Admin_role"]);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
