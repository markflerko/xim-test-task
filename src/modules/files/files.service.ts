import * as fs from "fs";
import * as path from "path";
import { Readable } from "stream";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../../data-source";
import removeFile from "../../utils/delete-file";
import User from "../users/users.entity";
import File from "./file.entity";

class FilesService {
  private fileRepository: Repository<File>;

  constructor() {
    this.initializeRepository();
  }

  private initializeRepository() {
    this.fileRepository = AppDataSource.manager.getRepository(File);
  }

  public deleteFileById = async (
    id: number
  ): Promise<{ affected: number } | { message: string }> => {
    const file = await this.findFileById(id);

    if (!file) {
      return { message: `No file found with id: ${id}` };
    }

    const { affected } = await this.fileRepository.delete(id);

    if (!affected) {
      return { message: `No deletion was performed` };
    }

    await removeFile(file.pathToFile);

    return { affected };
  };

  public getFiles = async (skip: number, take: number) => {
    const [items, count] = await this.fileRepository.findAndCount({
      order: {
        id: "ASC",
      },
      skip,
      take,
    });

    return {
      count,
      items,
    };
  };

  public fileUpload = async (file: Express.Multer.File) => {
    const { originalname, mimetype, size, buffer } = file;
    const extension = originalname.split(".").pop();
    const filename = `${uuidv4()}.${extension}`;

    const pathToFile = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      filename
    );

    const createdFile = await this.createFile({
      pathToFile,
      originalname,
      extension,
      mimetype,
      size,
    });

    createdFile["user"] = undefined;

    await fs.promises.writeFile(pathToFile, buffer);

    return createdFile;
  };

  public findFileById = (id: number) => {
    return this.fileRepository.findOne({ where: { id } });
  };

  public createFile = async (dto) => {
    const createdFile = this.fileRepository.create(dto);
    await this.fileRepository.save(createdFile);
    return createdFile;
  };

  // public findByIdAndUpdate = async (
  //   id: number,
  //   dto: Record<string, unknown>
  // ): Promise<File | { message: string }> => {
  //   const file = await this.findFileById(id);

  //   if (file) {
  //     Object.keys(dto).forEach((key) => {
  //       file[`${key}`] = dto[`${key}`];
  //     });
  //     await this.fileRepository.save(file);
  //     return file;
  //   } else {
  //     return {
  //       message: `File with id: ${id} not found`,
  //     };
  //   }
  // };
}

export default FilesService;
