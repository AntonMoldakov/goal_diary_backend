import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmEmailMail(email: string, code: number) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Goal Diary - Confirm Email',
        template: join(__dirname, 'templates', 'confirm-email.template.ejs'),
        context: {
          code,
        },
      });
    } catch (error) {
      // TODO: refactor error message
      throw new HttpException(`Email error: ${JSON.stringify(error)}`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
