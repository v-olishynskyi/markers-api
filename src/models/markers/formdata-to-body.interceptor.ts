import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export default function FormDataToBodyInterceptor(
  fields: { fieldName: string; extractToBody: boolean }[],
): Type<NestInterceptor> {
  class FormDataToBodyInterceptorClass implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();

      if (request.body) {
        fields.forEach(({ fieldName, extractToBody }) => {
          const bodyField = request.body[fieldName];

          if (bodyField) {
            if (extractToBody) {
              request.body = { ...request.body, ...JSON.parse(bodyField) };

              delete request.body[fieldName];
            } else {
              request.body[fieldName] = JSON.parse(bodyField);
            }
          }
        });
      }

      return next.handle();
    }
  }

  const Interceptor = mixin(FormDataToBodyInterceptorClass);
  return Interceptor;
}
