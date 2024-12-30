import { Request, Response } from 'express';
import logger from '../../config/logger.config';
import {
  AuthRepository,
  LoginUser,
  LoginUserDto,
  RegisterUser,
  RegisterUserDto,
} from '../../domain';
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
      res.status(400).json({ error });
    }
    try {
      const data = await new RegisterUser(this.authRepository, JwtAdapter.generateToken).execute(
        registerUserDto!,
      );
      res.status(201).json({ message: 'User registered successfully', data: data });
    } catch (error) {
      logger.error('Register user error' + error);
      this.errorHandler.handleError(error, res);
    }
  };

  loginUser = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
    }
    try {
      const data = await new LoginUser(this.authRepository, JwtAdapter.generateToken).execute(
        loginUserDto!,
      );
      res.status(200).json({ message: 'Login successful', data: data });
    } catch (error) {
      logger.error('Login user error' + error);
      this.errorHandler.handleError(error, res);
    }
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
