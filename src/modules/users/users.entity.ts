import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import File from "../files/file.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: "" })
  currentHashedRefreshToken: string;

  @OneToMany(() => File, (file: File) => file.user, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public files: File[];
}

export default User;
