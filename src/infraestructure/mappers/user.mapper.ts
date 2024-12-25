import { CustomError, UserEntity } from '../../domain';
import { Name, Email, Id, Password, Roles } from '../../shared';

export class UserMapper {
  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, email, password, roles } = object;

    const validatedId = new Id(id);
    const validatedName = new Name(name);
    const validatedEmail = new Email(email);
    const validatedPassword = new Password(password);
    const validatedRoles = new Roles(roles);

    return new UserEntity(
      validatedId.value,
      validatedName.value,
      validatedEmail.value,
      validatedPassword.value,
      validatedRoles.value,
    );
  }
}
