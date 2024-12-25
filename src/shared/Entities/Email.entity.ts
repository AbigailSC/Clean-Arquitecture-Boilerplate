import { CustomError } from '../../domain';
import { Validator } from '../validator';

export class Email extends Validator<string> {
  constructor(value: string) {
    super(value);
    this.validate();
  }

  protected validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.value || !emailRegex.test(this.value)) {
      throw CustomError.badRequest('Invalid email');
    }
  }
}
