import { getRepository } from 'typeorm';

import { hash } from 'bcryptjs';

import User from '../models/User';

import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}
class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExist = await userRepository.findOne({
      where: { email },
    });

    // Check if email is valid
    if (checkUserExist) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // Save user in database
    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
