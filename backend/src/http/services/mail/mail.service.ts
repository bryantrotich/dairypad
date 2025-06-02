import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/database/entities';
import { MailException } from 'src/http/exceptions';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  async sendUserConfirmation(user: UserEntity) {
    const url = `${this.configService.get('APP_URL')}/email/confirmation/${user.token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'register', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: `${user.first_name} ${user.last_name}`,
        url,
      },
    });
  }

  /**
   * Sends a confirmation email to a user.
   * 
   * @param user - The user to send the email to.
   * @returns A Promise that resolves when the email is sent.
   */
  async resetPassword({ token, email, role: { name: roleName } }: UserEntity) {

    try{
      let app_url = roleName == 'client' ? this.configService.get('app.APP_FRONTEND_URL') : this.configService.get('app.APP_DASHBOARD_URL');

      // Send the email.
      return await this.mailerService.sendMail({
        to: email,  // The recipient's email address.
        // from: '"Support Team" <support@example.com>', // override default from
        subject: `${this.configService.get<string>('APP_NAME') } Reset Account Password`,  // The subject of the email.
        template: 'user/reset-password',  // The name of the handlebars template to use.
        context: { // The data to pass to the template.
          reset_link: `${app_url}/auth/password/${token}/reset`, // The URL for the email verification link.
        },
      });

    } catch (error) {
      throw new MailException(error)
    }
  }
}