import { CustomError } from '../../domain';
import { Validator } from '../validator';

export class Name extends Validator<string> {
  constructor(value: string) {
    super(value);
    this.validate();
  }

  protected validate(): void {
    if (!this.value || typeof this.value !== 'string' || this.value.trim().length < 2) {
      throw CustomError.badRequest('Invalid name: must be at least 2 characters long');
    }
  }
}
