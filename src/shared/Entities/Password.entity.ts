import { CustomError } from '../../domain';
import { Validator } from '../validator';

export class Password extends Validator<string> {
  constructor(value: string) {
    super(value);
    this.validate();
  }

  protected validate(): void {
    if (this.value.length < 8) {
      throw CustomError.badRequest('Password must be at least 8 characters long.');
    }
  }
}
