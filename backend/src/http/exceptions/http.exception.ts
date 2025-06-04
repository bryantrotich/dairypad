import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    let ctx       = host.switchToHttp();
    let response  = ctx.getResponse<Response>();

    response.status(exception.getStatus()).json({ ...exception, timestamp: new Date().toLocaleDateString() });
  }
}