import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import RequestWithUser from "../interfaces/request-with-user.interface";
import TokenPayload from "../interfaces/token-payload.interface";
import UsersService from "../modules/users/users.service";
import tokensBlackList from "../utils/tokens-black-list";

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const authHeader = (request?.headers?.authorization as string) || "";
  const accessToken = authHeader.split(" ")[1];
  const isBlackListed = tokensBlackList.some((item) => item === accessToken);

  if (accessToken && !isBlackListed) {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    try {
      const verificationResponse = jwt.verify(
        accessToken,
        secret
      ) as TokenPayload;

      const id = verificationResponse.id;
      const userService = new UsersService();
      const user = await userService.findUserById(id);

      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
