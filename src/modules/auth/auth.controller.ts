import * as express from "express";
import { Request, Response } from "express";
import RequestWithUser from "../../interfaces/request-with-user.interface";
import authMiddleware from "../../middlewares/auth.middleware";
import refreshMiddleware from "../../middlewares/refresh.middleware";
import responseBuilder from "../../utils/responseBuilder";
import AuthService from "./auth.service";

class AuthController {
  public router = express.Router();
  public authService = new AuthService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get("/logout", authMiddleware, this.logout);
    this.router.get("/info", authMiddleware, this.getInfo);
    this.router.post("/signin/new_token", refreshMiddleware, this.refresh);
    this.router.post("/signup", this.signUp);
    this.router.post("/signin", this.signIn);
  }

  private logout = async (req: RequestWithUser, res: Response) => {
    await this.authService.setCurrentRefreshToken("", req.user.id);

    return responseBuilder({
      res,
      code: 204,
    });
  };

  private getInfo = (req: RequestWithUser, res: Response) => {
    return responseBuilder({
      res,
      code: 200,
      body: { id: req.user.id },
    });
  };

  private refresh = (req: Request, res: Response) => {
    return this.signIn(req, res);
  };

  private signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.authService.signIn({ email, password });
    if (result["message"]) {
      responseBuilder({
        res,
        code: 401,
        message: result["message"],
      });
    } else {
      responseBuilder({
        res,
        code: 200,
        body: result,
      });
    }
  };

  private signUp = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const createdUser = await this.authService.signUp({ email, password });

    responseBuilder({
      res,
      code: 201,
      body: createdUser,
    });
  };
}

export default AuthController;
