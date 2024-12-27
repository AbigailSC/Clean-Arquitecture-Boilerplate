import { Request, Response } from 'express';
import { AuthRepository, RegisterUserDto } from '../../domain';
import logger from '../../config/logger.config';
import { ErrorHandler } from '../../domain/errors';

export class AuthController {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly errorHandler: ErrorHandler,
  ) {}

  registerUser = async (req: Request, res: Response) => {
    try {
      const [error, registerUserDto] = RegisterUserDto.create(req.body);
      if (error) res.status(400).json({ error });
      const user = await this.authRepository.register(registerUserDto!);
      res.json(user);
    } catch (error) {
      logger.error('Register user error' + error);
      this.errorHandler.handleError(error, res);
    }
  };

  loginUser = async (_req: Request, res: Response) => {
    res.json('Login user controller');
  };
}
