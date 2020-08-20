import 'dotenv/config';

export default {
  jwt: {
    expiresIn: '1d',
    secret: process.env.JWT_SECRET,
  },
};
