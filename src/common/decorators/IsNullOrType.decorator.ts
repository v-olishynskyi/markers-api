import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export const IsNullOrType =
  (
    type:
      | 'string'
      | 'number'
      | 'bigint'
      | 'boolean'
      | 'symbol'
      | 'undefined'
      | 'object'
      | 'function',
    validationOptions?: ValidationOptions,
  ) =>
  (object: object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, options: ValidationArguments) {
          return value === 'null' || value === null || typeof value === type;
        },
      },
    });
