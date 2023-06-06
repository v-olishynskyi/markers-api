import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  private excludedFields: Array<string> = [];

  constructor(exclude: Array<string>) {
    this.excludedFields = exclude;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(
      'qweqweq',
      map((data) => {
        console.log('daata', data);
        return data;
      }),
    );

    return next.handle().pipe(map((data) => ({ data })));
  }
}
