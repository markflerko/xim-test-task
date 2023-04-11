import * as fs from "fs";
import * as path from "path";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../../data-source";
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
    const { affected } = await this.fileRepository.delete(id);

    if (!affected) {
      return { message: `No deletion was performed` };
    }

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

  public fileUpload = async (file: Express.Multer.File, user: User) => {
    const { originalname, mimetype, size, buffer } = file;
    const extension = originalname.split(".").pop();
    const localname = `${uuidv4()}.${extension}`;

    const createdFile = await this.createFile({
      localname,
      originalname,
      extension,
      mimetype,
      size,
      user,
    });

    createdFile["user"] = undefined;

    const pathToFile = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      localname
    );

    await fs.promises.writeFile(pathToFile, buffer);

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

  // public findFileById = (id: number) => {
  //   return this.fileRepository.findOne({ where: { id } });
  // };

  public createFile = async (dto) => {
    const createdFile = this.fileRepository.create(dto);
    await this.fileRepository.save(createdFile);
    return createdFile;
  };
}

export default FilesService;
