import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('should be able to create an User', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsers = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const Users = await createUsers.execute({
      name: 'Gabriel Coelho',
      email: 'gabriel.coelho@gobarber.com',
      password: '123123',
    });

    expect(Users).toHaveProperty('id');
  });

  it('should not create an User with the same e-mail', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUsers = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUsers.execute({
      name: 'Gabriel Coelho',
      email: 'gabriel.coelho@gobarber.com',
      password: '123123',
    });

    expect(
      createUsers.execute({
        name: 'Gabriel Coelho',
        email: 'gabriel.coelho@gobarber.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
