import express, { Router } from 'express';
import { morganMiddleware, LoggerMethods } from '../config/logger.config';

interface Options {
  port?: number;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;
  private readonly logger: LoggerMethods;

  constructor(options: Options, buildLogger: (service?: string) => LoggerMethods) {
    const { port = 3000, routes } = options;
    this.logger = buildLogger('server.ts');
    this.port = port;
    this.routes = routes;
  }

  async start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morganMiddleware);
    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      this.logger.info(`Server running on port ${this.port}`);
    });
  }
}
