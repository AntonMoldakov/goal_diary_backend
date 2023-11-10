import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '../config/config.service';
import { MailerOptions } from '@nestjs-modules/mailer';

export const getMailConfig = async (configService: ConfigService): Promise<MailerOptions> => {
  const transport = configService.getString('MAIL_TRANSPORT');
  const mailFromName = configService.getString('MAIL_FROM_NAME');
  const mailFromAddress = transport.split(':')[1].split('//')[1];

  return {
    transport,
    defaults: {
      from: `"${mailFromName}" <${mailFromAddress}>`,
    },
    template: {
      adapter: new EjsAdapter(),
      options: {
        strict: false,
      },
    },
  };
};
