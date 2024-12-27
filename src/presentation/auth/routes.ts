import { Router } from 'express';
import { AuthController } from './controller';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '../../infraestructure';
import { ErrorHandler } from '../../domain/errors';
import logger from '../../config/logger.config';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const errorHandler = new ErrorHandler(logger);

    const datasource = new AuthDataSourceImpl();
    const authRepository = new AuthRepositoryImpl(datasource);
    const controller = new AuthController(authRepository, errorHandler);

    router.post('/register', controller.registerUser);
    router.post('/login', controller.loginUser);

    return router;
  }
}
