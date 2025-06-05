import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { set } from 'lodash';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    let http               = host.switchToHttp();
    let exception_response = exception.getResponse();
    
    set(exception_response,'timestamp',new Date().toLocaleDateString());

    http.getResponse<Response>().status(exception.getStatus()).json(exception_response);
  }
}