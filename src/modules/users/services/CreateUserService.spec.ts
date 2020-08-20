import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUsers: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUsers = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
  });
  it('should be able to create an User', async () => {
    const Users = await createUsers.execute({
      name: 'Gabriel Coelho',
      email: 'gabriel.coelho@gobarber.com',
      password: '123123',
    });

    expect(Users).toHaveProperty('id');
  });

  it('should not create an User with the same e-mail', async () => {
    await createUsers.execute({
      name: 'Gabriel Coelho',
      email: 'gabriel.coelho@gobarber.com',
      password: '123123',
    });

    await expect(
      createUsers.execute({
        name: 'Gabriel Coelho',
        email: 'gabriel.coelho@gobarber.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
