import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from 'src/http/services';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

const path = require('path');

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        // transport: config.get("app.env.MAIL_TRANSPORT"),
        // or
        transport: {
          host: config.get('app.env.app.env.MAIL_HOST'),
          secure: JSON.parse(config.get('app.env.MAIL_SECURE')),
          auth: {
            user: config.get('app.env.MAIL_USER'),
            pass: config.get('app.env.MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('app.env.MAIL_FROM')}>`,
        },
        template: {
          dir: __dirname.replace(`${path.sep}modules`,`${path.sep}templates${path.sep}email`),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}