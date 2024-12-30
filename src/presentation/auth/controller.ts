import { Request, Response } from 'express';
import logger from '../../config/logger.config';
import { AuthRepository, RegisterUser, RegisterUserDto } from '../../domain';
import { ErrorHandler } from '../../domain/errors';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';

export class AuthController {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly errorHandler: ErrorHandler,
  ) {}

  registerUser = async (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    try {
      const data = await new RegisterUser(this.authRepository, JwtAdapter.generateToken).execute(
        registerUserDto!,
      );
      return res.status(201).json({ message: 'User registered successfully', data: data });
    } catch (error) {
      logger.error('Register user error' + error);
      this.errorHandler.handleError(error, res);
    }
  };

  loginUser = async (_req: Request, res: Response) => {
    res.json('Login user controller');
  };

  getUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await UserModel.find();
      res.json({ users });
    } catch (error) {
      logger.error('Get users error: ' + error);
    }
  };
}
