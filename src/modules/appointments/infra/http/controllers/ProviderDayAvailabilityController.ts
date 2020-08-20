import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.params.id;
    const { day, year, month } = req.query;

    const listProviderDayService = container.resolve(
      ListProviderDayAvailabilityService
    );

    const availability = await listProviderDayService.execute({
      day: Number(day),
      month: Number(month),
      provider_id,
      year: Number(year),
    });

    return res.json(availability);
  }
}
