import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  // Check if token was passed to th headers
  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // Bearer <token>
  const [, token] = authHeader.split(' ');

  const { secret } = authConfig.jwt;

  try {
    if (secret) {
      const decoded = verify(token, secret) as ITokenPayload;
      const { sub } = decoded;
      req.user = {
        id: sub,
      };

      return next();
    }
    throw new AppError(`Couldn't find JWT secret`, 500);
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
