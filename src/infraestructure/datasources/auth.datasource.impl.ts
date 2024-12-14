import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDataSource, CustomError, RegisterUserDto, UserEntity } from "../../domain";

export class AuthDataSourceImpl implements AuthDataSource {
  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;
    try {
      const exists = await UserModel.findOne({ email: email });
      if (exists) {
        throw CustomError.badRequest("Email already exists.");
      }

      const user = await UserModel.create({
        name: name,
        email: email,
        password: BcryptAdapter.hash(password),
      });

      await user.save();

      return new UserEntity(user.id, name, email, password, user.roles);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
