import { CustomError } from '../../domain';
import { Validator } from '../validator';

export class Roles extends Validator<Array<string>> {
  constructor(value: Array<string>) {
    super(value);
    this.validate();
  }
  validate() {
    if (!this.value) return;
    for (const role of this.value) {
      if (!role || !Validator.isString(role)) throw CustomError.badRequest('Invalid role.');
    }
  }
}
