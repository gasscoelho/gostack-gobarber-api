import 'reflect-metadata';

import '@shared/infra/typeorm';

import '@shared/container';

import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';

import cors from 'cors';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import routes from './routes';

class App {
  server: express.Express;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();

    this.server.use(
      (err: Error, req: Request, res: Response, _: NextFunction) => {
        if (err instanceof AppError) {
          return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
          });
        }

        console.error(err);

        return res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      }
    );
  }

  private middlewares(): void {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use('/files', express.static(uploadConfig.directory));
  }

  private routes(): void {
    this.server.use(routes);
  }
}

export default new App().server;
