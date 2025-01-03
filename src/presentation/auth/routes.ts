import { RequestHandler, Router } from 'express';
import { AuthController } from './controller';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '../../infraestructure';
import { ErrorHandler } from '../../domain/errors';
import { AuthMiddleware } from '../middlewares';
import { BcryptAdapter, buildLogger } from '../../config';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const errorHandler = new ErrorHandler(buildLogger);

    const datasource = new AuthDataSourceImpl(
      BcryptAdapter.hash,
      BcryptAdapter.compare,
      buildLogger,
    );
    const authRepository = new AuthRepositoryImpl(datasource);
    const controller = new AuthController(authRepository, errorHandler, buildLogger);

    router.post('/register', controller.registerUser);
    router.post('/login', controller.loginUser);
    router.get('/users', [AuthMiddleware.validateJwt as RequestHandler], controller.getUsers);

    return router;
  }
}
