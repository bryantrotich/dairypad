import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  
  /**
   * Intercept the request and timeout after 2 minutes.
   * This is a global interceptor that will timeout all requests after 2 minutes.
   * @param context The execution context of the request.
   * @param next The call handler for the request.
   * @returns An Observable of the request result value.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { REQUEST_TIMEOUT } = process.env;
    return next.handle().pipe(
      timeout(parseInt(REQUEST_TIMEOUT)),
      catchError(err => {
        // if the error is a timeout error, throw a RequestTimeoutException
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        // otherwise throw the original error
        return throwError(() => err);
      }),
    );
  };
};