import { getRepository } from 'typeorm';

import { compare } from 'bcryptjs';

import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    // Check if email is valid
    if (!user) {
      throw new AppError('Incorrect email or password combination', 403);
    }

    const passwordMatched = await compare(password, user.password);

    // Check if password is matched
    if (!passwordMatched) {
      throw new AppError('Incorrect email or password combination');
    }

    const { secret, expiresIn } = authConfig.jwt;

    // Check if JWT Secret was found
    if (!secret) {
      throw new AppError(`Couldn't find JWT secret`, 500);
    }

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
