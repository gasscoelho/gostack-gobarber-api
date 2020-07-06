import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUserService.execute({
      name: 'Gabriel Coelho',
      email: 'gabriel.coelho@gobarber.com',
      password: '123123',
    });

    const response = await authenticateUser.execute({
      email: 'gabriel.coelho@gobarber.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    expect(
      authenticateUser.execute({
        email: 'gabriel.coelho@gobarber.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate with invalid password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUserService.execute({
      name: 'Gabriel Coelho',
      email: 'gabriel.coelho@gobarber.com',
      password: '123123',
    });

    expect(
      authenticateUser.execute({
        email: 'gabriel.coelho@gobarber.com',
        password: '123120',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
