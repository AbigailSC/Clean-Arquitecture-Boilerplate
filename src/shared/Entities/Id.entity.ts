import { CustomError } from '../../domain';
import { Validator } from '../validator';

export class Id extends Validator<string> {
  constructor(value: string) {
    super(value);
    this.validate();
  }

  protected validate(): void {
    if (!this.value.match(/^[a-fA-F0-9]{24}$/)) {
      throw CustomError.badRequest('Invalid ID format.');
    }
  }
}
