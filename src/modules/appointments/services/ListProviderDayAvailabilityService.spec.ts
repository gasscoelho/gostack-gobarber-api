// import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('List Providers Day Availability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list the day availability from provider', async () => {
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

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      day: 20,
      month: 5,
      provider_id: 'user-provider-id',
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { available: false, hour: 8 },
        { available: false, hour: 9 },
        { available: false, hour: 10 },
        { available: true, hour: 13 },
        { available: false, hour: 14 },
        { available: false, hour: 15 },
        { available: true, hour: 16 },
      ])
    );
  });
});
