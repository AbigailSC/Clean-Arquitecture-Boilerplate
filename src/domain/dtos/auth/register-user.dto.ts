import { Validators } from "../../../config";

export class RegisterUserDto {
  private constructor(public name: string, public email: string, public password: string) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;

    if (!name) return ["Missing name", undefined];
    if (!email) return ["Missing email", undefined];
    if (!Validators.email.test(email)) return ["Password is not valid", undefined];
    if (!password) return ["Missing password", undefined];
    if (password.length < 6) return ["Password too short"];
    return [undefined, new RegisterUserDto(name, email.toLowerCase(), password)];
  }
}
