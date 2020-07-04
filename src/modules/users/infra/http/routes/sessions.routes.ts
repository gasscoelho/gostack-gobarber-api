import { Router } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

import { container } from 'tsyringe';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const authenticateUser = container.resolve(AuthenticateUserService);

  const { user, token } = await authenticateUser.execute({ email, password });

  // Delete password field from user object
  delete user.password;

  return res.json({ user, token });
});

export default sessionsRouter;
