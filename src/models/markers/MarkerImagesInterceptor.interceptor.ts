import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class MarkerImagesInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        const images = data.images.map((id) => ({
          id,
          uri: `http://localhost:3001/images/${id}`,
        }));
        console.log(
          'file: MarkerImagesInterceptor.interceptor.ts:23 - MarkerImagesInterceptor - images - images:',
          images,
        );

        return { ...data, images };
      }),
    );
  }
}
