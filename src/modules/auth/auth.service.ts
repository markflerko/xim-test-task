import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import TokenPayload from "../../interfaces/token-payload.interface";
import UsersService from "../users/users.service";

class AuthService {
  private userService = new UsersService();

  public getUserIfRefreshTokenMatches = async (refreshToken: string, id: number) => {
    const user = await this.userService.findUserById(id);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

   public setCurrentRefreshToken = async (refreshToken: string, id: number) => {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.findByIdAndUpdate(id, {
      currentHashedRefreshToken,
    });
  }

  private getJwtRefreshToken = (id: number) => {
    const payload: TokenPayload = { id };
    const expiresIn = "604800s";
    const secret = process.env.REFRESH_TOKEN_SECRET;

    const token = jwt.sign(payload, secret, { expiresIn });

    return { refresh_token: token };
  }

  private getJwtAccessToken = (id: number) => {
    const payload: TokenPayload = { id };
    const expiresIn = "600s";
    const secret = process.env.ACCESS_TOKEN_SECRET;

    const token = jwt.sign(payload, secret, { expiresIn });

    return { access_token: token };
  }

  public signIn = async ({
    email,
    password,
  }): Promise<
    { access_token: string; refresh_token: string } | { message: string }
  > => {
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      const isPasswordMatching = await bcrypt.compare(password, user.password);
      if (isPasswordMatching) {
        const { access_token } = this.getJwtAccessToken(user.id);
        const { refresh_token } = this.getJwtRefreshToken(user.id);
        await this.setCurrentRefreshToken(refresh_token, user.id);

        return { access_token, refresh_token };
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
