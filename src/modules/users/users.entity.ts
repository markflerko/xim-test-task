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
}

export default User;
