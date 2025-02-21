import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail({
    subject,
    email,
    name,
    activationCode,
    template,
  }: {
    subject: string;
    email: string;
    name: string;
    activationCode: string;
    template: string;
  }) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context: {
        name,
        activationCode,
      },
    });
  }
}
