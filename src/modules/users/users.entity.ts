import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  password: string;

  @Column({ default: "" })
  currentHashedRefreshToken: string;
}

export default User;
