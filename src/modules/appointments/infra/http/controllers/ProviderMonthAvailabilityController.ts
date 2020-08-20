import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.params.id;
    const { month, year } = req.query;

    const listProviderMonthService = container.resolve(
      ListProviderMonthAvailabilityService
    );

    const availability = await listProviderMonthService.execute({
      month: Number(month),
      provider_id,
      year: Number(year),
    });

    return res.json(availability);
  }
}
