import { Request, Response } from "express";
import { AuthRepository, RegisterUserDto } from "../../domain";
import logger from "../../infraestructure/logger/logger.config";
import { stringify } from "querystring";

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  registerUser = async (req: Request, res: Response) => {
    try {
      const [error, registerUserDto] = RegisterUserDto.create(req.body);
      if (error) res.status(400).json({ error });
      const user = await this.authRepository.register(registerUserDto!);
      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  loginUser = async (_req: Request, res: Response) => {
    res.json("Login user controller");
  };
}
