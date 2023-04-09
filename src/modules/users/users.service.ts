import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "./users.entity";

class UsersService {
  private userRepository: Repository<User>;

  constructor() {
    this.initializeRepository();
  }

  private initializeRepository() {
    this.userRepository = AppDataSource.manager.getRepository(User);
  }

  public getUsers = () => {
    return this.userRepository.find();
  };

  public signup = async ({ email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(createdUser);

    return createdUser;
  };
}

export default UsersService;
