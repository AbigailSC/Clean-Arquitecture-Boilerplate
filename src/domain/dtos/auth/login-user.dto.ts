import { Validators } from '../../../config';

export class LoginUserDto {
  private constructor(
    public email: string,
    public password: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    if (!email) return ['Missing email', undefined];
    if (!Validators.email.test(email)) return ['Password is not valid', undefined];
    if (!password) return ['Missing password', undefined];
    if (password.length < 6) return ['Password too short'];
    return [undefined, new LoginUserDto(email.toLowerCase(), password)];
  }
}
