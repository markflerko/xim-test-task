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
  localname: string;

  @Column()
  originalname: string;

  @Column()
  extension: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @ManyToOne(() => User, (user: User) => user.files)
  user: User;

  @CreateDateColumn({ type: "timestamp" })
  uploadDate: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}

export default File;
