import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointimentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

interface IDate {
  day: number;
  month: number;
  year: number;
  hour: number;
}

let fakeAppointmentRepository: FakeAppointimentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

const currentDate = {} as IDate;
const today = new Date();

describe('CreateAppointment', () => {
  beforeAll(() => {
    currentDate.day = today.getDate();
    currentDate.month = today.getMonth();
    currentDate.year = today.getFullYear();
    currentDate.hour = today.getHours();
  });

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointimentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  it('should be able to create an Appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(
        currentDate.year,
        currentDate.month,
        currentDate.day,
        9
      ).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(currentDate.year, currentDate.month, currentDate.day, 11),
      provider_id: '123123',
      user_id: '321321',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two Appointments at the same time', async () => {
    const date = new Date(
      currentDate.year,
      currentDate.month,
      currentDate.day,
      11
    );

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(
        currentDate.year,
        currentDate.month,
        currentDate.day,
        9
      ).getTime();
    });

    await createAppointment.execute({
      date,
      provider_id: '123123',
      user_id: '321321',
    });

    expect(
      createAppointment.execute({
        date,
        provider_id: '123123',
        user_id: '321321',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(
        currentDate.year,
        currentDate.month,
        currentDate.day,
        12
      ).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(
          currentDate.year,
          currentDate.month,
          currentDate.day,
          11
        ),
        user_id: '123123',
        provider_id: '321321',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(
        currentDate.year,
        currentDate.month,
        currentDate.day,
        9
      ).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(
          currentDate.year,
          currentDate.month,
          currentDate.day,
          11
        ),
        user_id: '123123',
        provider_id: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8 and after 17', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(
        currentDate.year,
        currentDate.month,
        currentDate.day - 1,
        12
      ).getTime();
    });

    await await expect(
      createAppointment.execute({
        date: new Date(currentDate.year, currentDate.month, currentDate.day, 7),
        user_id: '123123',
        provider_id: '321321',
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(
          currentDate.year,
          currentDate.month,
          currentDate.day,
          18
        ),
        user_id: '123123',
        provider_id: '321321',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
