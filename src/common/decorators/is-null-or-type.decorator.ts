import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { TypesEnum } from 'src/common/shared/enums/types.enum';

export const IsNullOrType =
  (type: TypesEnum, validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, options: ValidationArguments) {
          return (
            value === TypesEnum.Null || value === null || typeof value === type
          );
        },
      },
    });
