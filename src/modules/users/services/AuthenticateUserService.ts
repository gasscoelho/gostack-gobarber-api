import { compare } from 'bcryptjs';

import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';

import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUserRepository';

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
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

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
