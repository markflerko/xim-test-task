import * as express from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "./users.entity";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";

class UsersController {
  public router = express.Router();
  public userRepository: Repository<User>;

  constructor() {
    this.initializeRoutes();
    this.initializeRepository();
    this.signup = this.signup.bind(this);
  }

  public initializeRepository() {
    this.userRepository = AppDataSource.manager.getRepository(User);
  }

  public initializeRoutes() {
    this.router.get("/profiles", this.getUsers);
    this.router.post("/signup", this.signup);
  }

  private getUsers = async (request: express.Request, response: express.Response) => {
    const users = await this.userRepository.find()

    response.send(users);
  };

  private signup = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(createdUser);

    response.send(createdUser);
  }
}

export default UsersController;
