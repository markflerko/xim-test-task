import * as express from "express";
import { Response } from "express";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import RequestWithUser from "../../interfaces/request-with-user.interface";
import authMiddleware from "../../middlewares/auth.middleware";
import cpUploadMiddleware from "../../middlewares/cp-upload.middleware";
import responseBuilder from "../../utils/responseBuilder";
import FilesService from "./files.service";

class FilesController {
  public router = express.Router();
  public fileService = new FilesService();

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
    const { originalname, mimetype, size, buffer } = file[0];
    const extension = originalname.split(".").pop();
    const localname = `${uuidv4()}.${extension}`;

    const createdFile = await this.fileService.createFile({
      localname,
      originalname,
      extension,
      mimetype,
      size,
    });

    const pathToFile = path.join(__dirname, "..", '..', '..', "public", localname);

    await fs.promises.writeFile(pathToFile, buffer);

    return responseBuilder({
      res,
      code: 201,
      body: createdFile,
    });
  };
}

export default FilesController;
