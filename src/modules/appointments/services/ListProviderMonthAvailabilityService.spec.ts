// import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('List Providers Month Availability', () => {
  beforeEach(() => {
    // fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 8, 0, 0),
      provider_id: 'user-provider-id',
      user_id: 'user-id',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 9, 0, 0),
      provider_id: 'user-provider-id',
      user_id: 'user-id',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 10, 0, 0),
      provider_id: 'user-provider-id',
      user_id: 'user-id',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 11, 0, 0),
      provider_id: 'user-provider-id',
      user_id: 'user-id',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 12, 0, 0),
      provider_id: 'user-provider-id',
      user_id: 'user-id',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 13, 0, 0),
      provider_id: 'user-provider-id',
      user_id: 'user-id',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 14, 0, 0),
      provider_id: 'user-provider-id',
      user_id: 'user-id',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 15, 0, 0),
      provider_id: 'user-provider-id',
      user_id: 'user-id',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 16, 0, 0),
      provider_id: 'user-provider-id',
      user_id: 'user-id',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 17, 0, 0),
      provider_id: 'user-provider-id',
      user_id: 'user-id',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 21, 8, 0, 0),
      provider_id: 'user-provider-id',
      user_id: 'user-id',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 19, 7).getTime();
    });

    const availability = await listProviderMonthAvailability.execute({
      month: 5,
      provider_id: 'user-provider-id',
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { available: true, day: 19 },
        { available: false, day: 20 },
        { available: true, day: 21 },
        { available: true, day: 23 },
      ])
    );
  });
});
