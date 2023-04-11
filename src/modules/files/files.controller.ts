import * as express from "express";
import { Response } from "express";
import * as fs from "fs";
import RequestWithUser from "../../interfaces/request-with-user.interface";
import authMiddleware from "../../middlewares/auth.middleware";
import cpUploadMiddleware from "../../middlewares/cp-upload.middleware";
import responseBuilder from "../../utils/responseBuilder";

class FilesController {
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      "/file/upload",
      authMiddleware,
      cpUploadMiddleware,
      this.fileUpload
    );
  }

  private fileUpload = async (req: RequestWithUser, res: Response) => {
    const { file } = req.files as Record<string, Express.Multer.File[]>;

    // const pathToFile = path.join(
    //   __dirname,
    //   "..",
    //   "public",
    //   uuidv4(),
    //   file[0].originalname.split(".").pop()
    // );

    await fs.promises.writeFile(`/tmp/${file[0].originalname}`, file[0].buffer);

    return responseBuilder({
      res,
      code: 204,
    });
  };
}

export default FilesController;
