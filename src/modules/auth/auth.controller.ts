import * as express from "express";
import { Request, Response } from "express";
import UsersService from "../users/users.service";

class AuthController {
  public router = express.Router();
  public userService = new UsersService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get("/profiles", this.getUsers);
    this.router.post("/signup", this.signup);
  }

  private getUsers = async (
    request: express.Request,
    response: express.Response
  ) => {
    const users = await this.userService.getUsers();

    response.send(users);
  };

  private signup = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const createdUser = await this.userService.signup({ email, password });

    response.send(createdUser);
  };
}

export default AuthController;
