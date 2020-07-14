import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });
  it('should be able to authenticate', async () => {
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
    await expect(
      authenticateUser.execute({
        email: 'gabriel.coelho@gobarber.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate with invalid password', async () => {
    await createUserService.execute({
      name: 'Gabriel Coelho',
      email: 'gabriel.coelho@gobarber.com',
      password: '123123',
    });

    await expect(
      authenticateUser.execute({
        email: 'gabriel.coelho@gobarber.com',
        password: '123120',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
