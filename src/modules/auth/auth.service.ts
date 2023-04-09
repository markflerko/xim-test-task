import * as bcrypt from "bcrypt";
import UsersService from "../users/users.service";
import { User } from "./../users/users.entity";

class AuthService {
  private userService = new UsersService();

  public signIn = async ({
    email,
    password,
  }): Promise<User | { message: string }> => {
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      const isPasswordMatching = await bcrypt.compare(password, user.password);
      if (isPasswordMatching) {
        user.password = undefined;
        return user;
      } else {
        return { message: "Wrong credentials provided" };
      }
    } else {
      return { message: `No user found with email: ${email}` };
    }
  };

  public signUp = async ({ email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userService.createUser({ email, password: hashedPassword });
  };
}

export default AuthService;
