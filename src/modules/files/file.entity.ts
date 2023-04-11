import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
class File {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  localname: string;

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
