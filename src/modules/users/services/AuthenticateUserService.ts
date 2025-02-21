import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';

import IUsersRepository from '../repositories/IUserRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    // Check if email is valid
    if (!user) {
      throw new AppError('Incorrect email or password combination', 403);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password
    );

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
      expiresIn,
      subject: user.id,
    });

    return { token, user };
  }
}

export default AuthenticateUserService;
