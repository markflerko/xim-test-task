import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import File from "./file.entity";

class FilesService {
  private fileRepository: Repository<File>;

  constructor() {
    this.initializeRepository();
  }

  private initializeRepository() {
    this.fileRepository = AppDataSource.manager.getRepository(File);
  }

  async findByIdAndUpdate(
    id: number,
    dto: Record<string, unknown>
  ): Promise<File | { message: string }> {
    const file = await this.findFileById(id);

    if (file) {
      Object.keys(dto).forEach((key) => {
        file[`${key}`] = dto[`${key}`];
      });
      await this.fileRepository.save(file);
      return file;
    } else {
      return {
        message: `File with id: ${id} not found`,
      };
    }
  }

  public findFileById = (id: number) => {
    return this.fileRepository.findOne({ where: { id } });
  };

  public createFile = async (dto) => {
    const createdFile = this.fileRepository.create(dto);
    await this.fileRepository.save(createdFile);
    return createdFile;
  };
}

export default FilesService;
