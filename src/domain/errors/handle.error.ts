import { CustomError } from './custom.error';
import { Response } from 'express';
import { LoggerMethods } from '../../config';

export class ErrorHandler {
  private readonly logger: LoggerMethods;

  constructor(buildLogger: (service?: string) => LoggerMethods) {
    this.logger = buildLogger('handle.error.ts');
  }

  public handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      this.logger.error(`AuthController ${error.name} error: ${error.message}`);
      return res.status(error.statusCode).json({ status: error.statusCode, error: error.message });
    }
    this.logger.error(`AuthController unknown error: ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };
}
