import AppError from '@shared/errors/AppError';
import FakeAppointimentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create an Appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointimentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two Appointments at the same time', async () => {
    const fakeAppointmentRepository = new FakeAppointimentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository
    );

    const date = new Date();

    await createAppointment.execute({
      date,
      provider_id: '123123',
    });

    expect(
      createAppointment.execute({
        date,
        provider_id: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
