import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
  });
  it('should be able to update an User avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Gabriel Coelho',
      email: 'gabriel.coelho@gobarber.com',
      password: '123123',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update an avatar from a nonexistent user', async () => {
    expect(
      updateUserAvatar.execute({
        user_id: 'non-existent-user',
        avatarFilename: 'avatar.png',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when a new one is updated', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Gabriel Coelho',
      email: 'gabriel.coelho@gobarber.com',
      password: '123123',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar-2.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toBe('avatar-2.png');
  });
});
