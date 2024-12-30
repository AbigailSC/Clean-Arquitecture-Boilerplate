import { RequestHandler, Router } from 'express';
import { AuthController } from './controller';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '../../infraestructure';
import { ErrorHandler } from '../../domain/errors';
import logger from '../../config/logger.config';
import { AuthMiddleware } from '../middlewares';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const errorHandler = new ErrorHandler(logger);

    const datasource = new AuthDataSourceImpl();
    const authRepository = new AuthRepositoryImpl(datasource);
    const controller = new AuthController(authRepository, errorHandler);

    router.post('/register', controller.registerUser);
    router.post('/login', controller.loginUser);
    router.get('/users', [AuthMiddleware.validateJwt as RequestHandler], controller.getUsers);

    return router;
  }
}
