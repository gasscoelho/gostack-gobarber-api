import AppError from '@shared/errors/AppError';
import FakeAppointimentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointimentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointimentsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  });

  it('should be able to create an Appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two Appointments at the same time', async () => {
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
