import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  /**
   * Intercept the result of a controller method and throw a NotFoundException
   * if the result is undefined.
   * @param context The execution context of the controller method.
   * @param next The call handler for the controller method.
   * @returns An Observable of the controller method's result value.
   */
  intercept(
    context: ExecutionContext, 
    next:    CallHandler
  ): Observable<any> {
    return next.handle()
      .pipe(
        tap(
            data => {
              // console.log(data);
                if (data === undefined) throw new NotFoundException();
            }
        )
    );
  }
}