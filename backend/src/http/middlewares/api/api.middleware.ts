import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { isEmpty, intersection } from 'lodash';

@Injectable()
export default class ApiMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    let { headers: { accept } }: any = req;
    console.log(accept);
    if( !isEmpty(intersection(accept.split(','),['text/html','application/xhtml+xml','application/xml;q=0.9'])) ) {
      throw new HttpException('Not Acceptable',HttpStatus.NOT_ACCEPTABLE);
    }

    next();
  }
}
