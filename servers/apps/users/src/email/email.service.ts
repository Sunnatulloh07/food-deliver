import { Injectable } from '@nestjs/common';
import { mailOptions } from '../types/mail-options';
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
  }: mailOptions) {
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
