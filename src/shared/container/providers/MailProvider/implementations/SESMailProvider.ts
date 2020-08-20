import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import aws from 'aws-sdk';

import mailConfig from '@config/mail';

import IMailProvider from '../models/IMailProvider';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-2',
      }),
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    template,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;
    await this.client.sendMail({
      from: {
        address: from?.email || email,
        name: from?.name || name,
      },
      html: await this.mailTemplateProvider.parse(template),
      subject,
      to: {
        address: to.email,
        name: to.name,
      },
    });
  }
}
