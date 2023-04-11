import * as express from "express";
import { Response } from "express";
import * as fs from "fs";
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
    this.router.put(
      "/file/update/:id",
      authMiddleware,
      cpUploadMiddleware,
      this.updateFileById
    );
    this.router.get(
      "/file/download/:id",
      authMiddleware,
      this.downloadFileById
    );
    this.router.get("/file/list", authMiddleware, this.getFiles);
    this.router.get("/file/:id", authMiddleware, this.getFileById);
    this.router.delete("/file/delete/:id", authMiddleware, this.deleteFileById);
    this.router.post(
      "/file/upload",
      authMiddleware,
      cpUploadMiddleware,
      this.fileUpload
    );
  }

  private downloadFileById = async (req: RequestWithUser, res: Response) => {
    const id = Number(req.params.id);

    if (isFinite(id)) {
      const file = await this.fileService.findFileById(id);

      if (!file) {
        return responseBuilder({
          res,
          code: 404,
          message: `No file found with id: ${id}`,
        });
      }

      res.set({
        "Content-Disposition": `inline; filename="${file.originalname}"`,
        "Content-Type": file.mimetype,
      });

      return fs.createReadStream(file.pathToFile).pipe(res);
    }

    return responseBuilder({
      res,
      code: 400,
      message: `Provided id: ${id} isn't valid`,
    });
  };

  private getFileById = async (req: RequestWithUser, res: Response) => {
    const id = Number(req.params.id);

    if (isFinite(id)) {
      const result = await this.fileService.findFileById(id);

      if (result) {
        return responseBuilder({
          res,
          body: result,
          code: 200,
        });
      }

      return responseBuilder({
        res,
        code: 404,
        message: `No file found with id: ${id}`,
      });
    }

    return responseBuilder({
      res,
      code: 400,
      message: `Provided id: ${id} isn't valid`,
    });
  };

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

  private updateFileById = async (req: RequestWithUser, res: Response) => {
    const id = Number(req.params.id);

    if (isFinite(id)) {
      const { file } = req.files as Record<string, Express.Multer.File[]>;

      const result = await this.fileService.updateFileById(file[0], id);

      if (result["message"]) {
        return responseBuilder({
          res,
          code: 404,
          body: result["message"],
        });
      }

      return responseBuilder({
        res,
        code: 200,
        body: result,
      });
    }

    return responseBuilder({
      res,
      code: 400,
      message: `Provided id: ${id} isn't valid`,
    });
  };

  private fileUpload = async (req: RequestWithUser, res: Response) => {
    const { file } = req.files as Record<string, Express.Multer.File[]>;

    const createdFile = await this.fileService.fileUpload(file[0]);

    return responseBuilder({
      res,
      code: 201,
      body: createdFile,
    });
  };
}

export default FilesController;
