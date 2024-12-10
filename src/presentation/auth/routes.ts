import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDataSourceImpl, AuthRepositoryImpl } from "../../infraestructure";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new AuthDataSourceImpl();
    const authRepository = new AuthRepositoryImpl(datasource);
    const controller = new AuthController(authRepository);

    router.post("/register", controller.registerUser);
    router.post("/login", controller.loginUser);

    return router;
  }
}
