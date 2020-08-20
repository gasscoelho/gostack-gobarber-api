import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';

import IMailProvider from '../models/IMailProvider';

import ISendMailDTO from '../dtos/ISendMailDTO';

import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        auth: {
          pass: account.pass,
          user: account.user,
        },
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
      });
      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    template,
  }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        address: from?.email || 'equipe@gobarber.com.br',
        name: from?.name || 'Equipe GoBarber',
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
