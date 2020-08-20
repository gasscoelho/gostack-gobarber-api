import 'reflect-metadata';

import '@shared/infra/typeorm';
import '@shared/container';

import express, { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';

import 'express-async-errors';

import cors from 'cors';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

class App {
  server: express.Express;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();

    this.server.use(errors());

    this.server.use(
      (err: Error, req: Request, res: Response, _: NextFunction) => {
        if (err instanceof AppError) {
          return res.status(err.statusCode).json({
            message: err.message,
            status: 'error',
          });
        }

        return res.status(500).json({
          message: 'Internal server error',
          status: 'error',
        });
      }
    );
  }

  private middlewares(): void {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use('/files', express.static(uploadConfig.uploadFolder));
    this.server.use(rateLimiter);
  }

  private routes(): void {
    this.server.use(routes);
  }
}

export default new App().server;
