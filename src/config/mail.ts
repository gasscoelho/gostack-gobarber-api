interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  defaults: {
    from: {
      email: 'gabriel@gasscoelho.me',
      name: 'Gabriel Coelho',
    },
  },
  driver: process.env.MAIL_DRIVER || 'ethereal',
} as IMailConfig;
