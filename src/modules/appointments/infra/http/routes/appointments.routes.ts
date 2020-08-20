import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentRouter.use(ensureAuthenticated);

appointmentRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      date: Joi.date(),
      provider_id: Joi.string().uuid().required(),
    },
  }),
  appointmentsController.create
);
appointmentRouter.get('/me', providerAppointmentsController.index);

export default appointmentRouter;
