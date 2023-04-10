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

  public findUserById = (id: number) => {
    return this.userRepository.findOne({ where: { id } });
  };

  public findUserByEmail = (email: string) => {
    return this.userRepository.findOne({ where: { email } });
  };

  public createUser = async (dto) => {
    const createdUser = this.userRepository.create(dto);
    await this.userRepository.save(createdUser);
    return createdUser;
  };
}

export default UsersService;
