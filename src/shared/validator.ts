export class Validator<T> {
  constructor(public readonly value: T) {}

  protected validate(): void {
    throw new Error('Not implemented');
  }
  public static isString(value: any): value is string {
    return typeof value === 'string';
  }
}
