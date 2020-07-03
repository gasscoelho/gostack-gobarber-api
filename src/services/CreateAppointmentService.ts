import { startOfHour } from 'date-fns';

import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';

import AppointmentRepository from '../repositories/AppointmentsRepository';

import AppError from '../errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentRepository);

    const appointmentDate = startOfHour(date);

    const isAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate
    );

    // Check if date is available
    if (isAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // Save Appointment in database
    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
