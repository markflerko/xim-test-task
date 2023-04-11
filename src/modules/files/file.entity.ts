import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "../users/users.entity";

@Entity()
class File {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  pathToFile: string;

  @Column()
  originalname: string;

  @Column()
  extension: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @CreateDateColumn({ type: "timestamp" })
  uploadDate: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}

export default File;
