import * as express from "express";
import { Request, Response } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import responseBuilder from "../../utils/responseBuilder";
import AuthService from "./auth.service";

class AuthController {
  public router = express.Router();
  public authService = new AuthService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get("/profile", authMiddleware, this.profile);
    this.router.post("/signup", this.signUp);
    this.router.post("/signin", this.signIn);
  }

  private profile = (_, res) => {
    responseBuilder({
      res,
      code: 200,
      body: 'Безумно',
    });
  }

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

    res.send(createdUser);
  };
}

export default AuthController;
