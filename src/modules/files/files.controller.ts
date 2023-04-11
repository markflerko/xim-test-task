import * as express from "express";
import { Response } from "express";
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
    this.router.delete(
      "/file/delete/:id",
      authMiddleware,
      cpUploadMiddleware,
      this.deleteFileById
    );
    this.router.get(
      "/file/list",
      authMiddleware,
      cpUploadMiddleware,
      this.getFiles
    );
    this.router.post(
      "/file/upload",
      authMiddleware,
      cpUploadMiddleware,
      this.fileUpload
    );
  }

  private deleteFileById = async (req: RequestWithUser, res: Response) => {
    const id = Number(req.params.id);

    if (isFinite(id)) {
      const result = await this.fileService.deleteFileById(id);

      if (result["affected"]) {
        return responseBuilder({
          res,
          code: 204,
        });
      }

      return responseBuilder({
        res,
        code: 404,
        message: result["message"],
      });
    }

    return responseBuilder({
      res,
      code: 400,
      message: `Provided id: ${id} isn't valid`,
    });
  };

  private getFiles = async (req: RequestWithUser, res: Response) => {
    const { page, list_size } = req.query;

    const take =
      isFinite(Number(list_size)) && Number(list_size) > 0
        ? Number(list_size)
        : 10;
    const skip =
      isFinite(Number(page)) && Number(page) > 0
        ? (Number(page) - 1) * take
        : 0;

    const result = await this.fileService.getFiles(skip, take);

    return responseBuilder({
      res,
      code: 200,
      body: result,
    });
  };

  //req also have files, not only user
  private fileUpload = async (req: RequestWithUser, res: Response) => {
    const { file } = req.files as Record<string, Express.Multer.File[]>;

    const createdFile = await this.fileService.fileUpload(file[0], req.user);

    return responseBuilder({
      res,
      code: 201,
      body: createdFile,
    });
  };
}

export default FilesController;
