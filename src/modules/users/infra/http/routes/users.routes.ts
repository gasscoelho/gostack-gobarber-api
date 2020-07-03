import { Router } from 'express';

import multer from 'multer';

import uploadConfig from '@config/upload';

import CreateUserService from '@modules/users/services/CreateUserService';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  try {
    const usersRepository = new UsersRepository();
    const { name, email, password } = req.body;

    const createUser = new CreateUserService(usersRepository);

    const user = await createUser.execute({ name, email, password });

    // Avoid password to be displayed in json
    delete user.password;

    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const usersRepository = new UsersRepository();
    const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.json({ user });
  }
);

export default usersRouter;
