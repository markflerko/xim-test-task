import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import RequestWithUser from "../interfaces/request-with-user.interface";
import TokenPayload from "../interfaces/token-payload.interface";
import AuthService from "../modules/auth/auth.service";

async function refreshMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const refreshHeader = (request?.headers?.refresh as string) || "";
  const refreshToken = refreshHeader.split(" ")[1];

  if (refreshToken) {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    try {
      const verificationResponse = jwt.verify(
        refreshToken,
        secret
      ) as TokenPayload;

      const id = verificationResponse.id;
      const authService = new AuthService();
      const user = await authService.getUserIfRefreshTokenMatches(
        refreshToken,
        id
      );

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

export default refreshMiddleware;
