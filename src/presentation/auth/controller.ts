import { NextFunction, Request, Response } from 'express';
import logger from '../../config/logger.config';
import { AuthRepository, RegisterUserDto } from '../../domain';
import { ErrorHandler } from '../../domain/errors';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';

export class AuthController {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly errorHandler: ErrorHandler,
  ) {}

  registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [error, registerUserDto] = RegisterUserDto.create(req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const user = await this.authRepository.register(registerUserDto!);
      const token = await JwtAdapter.generateToken({ id: user.id });

      res.json({
        user: user,
        token: token,
      });
    } catch (error) {
      logger.error('Register user error' + error);
      this.errorHandler.handleError(error, res);
      next(error);
    }
  };

  loginUser = async (_req: Request, res: Response) => {
    res.json('Login user controller');
  };

  getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await UserModel.find();
      res.json({ users });
    } catch (error) {
      logger.error('Get users error: ' + error);
      next(error);
    }
  };
}
