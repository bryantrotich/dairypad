import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import * as bodyParser from 'body-parser';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import  'winston-daily-rotate-file';
import { useContainer } from 'class-validator';
import { HttpExceptionFilter } from './http/exceptions';

// Directory separator
const { sep } = require('path');

async function bootstrap() {
  const home = !process.cwd().includes('backend') ? `${process.cwd()}${sep}backend` : process.cwd();
  const app  = await NestFactory.create<NestExpressApplication>(
    AppModule,
    { 
      cors:     true,  
      logger: WinstonModule.createLogger({
        transports: [
          // let's log errors into its own file
          new transports.DailyRotateFile({
            dirname: `${home}${sep}public${sep}logs${sep}`,
            filename: `error-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            format: format.combine(
              format.timestamp(), 
              format.json(),
              format.splat(),
              format.printf((error) => {
                if ( !isEmpty(error.stack) ) {
                  // print log trace 
                  // return `${error.timestamp} ${error.level}: ${error.message} - ${error.context} - ${error.stack.map( val => JSON.stringify(val)).join(',')}`;
                }
                return `${error.timestamp} ${error.level}: ${error.message} - ${error.context}`;
              }),
            ),
          }),

          // logging all level
          new transports.DailyRotateFile({
            dirname: `${home}${sep}public${sep}logs${sep}`,
            filename: `info-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            format: format.combine(
              format.timestamp(), 
              format.json(),
              format.printf(({ context, level, message, timestamp, }) => {
                return `${timestamp} ${level}: ${message} - ${context}`;
              }),
            ),
          }),
          // we also want to see logs in our console
          new transports.Console({
           format: format.combine(
             format.cli(),
             format.splat(),
             format.timestamp(),
             format.printf((info) => {
              if ( !isEmpty(info.stack) ) {
                // print log trace 
                // return `${info.timestamp} ${info.level}: ${info.message} - ${info.context} - ${info.stack.map( val => JSON.stringify(val)).join(',')}`;
              }
              return `${info.timestamp} ${info.level}: ${info.context} ${info.message}`;
             }),
            ),
        }),
        ],
      }),     
      snapshot: true
    }
  );
  const { APP_PORT } = process.env;

  app.useGlobalFilters(new HttpExceptionFilter())
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  // app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useStaticAssets(resolve('/public'));
  
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(APP_PORT);

}

bootstrap();

