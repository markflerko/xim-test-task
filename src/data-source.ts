import { DataSource } from "typeorm";
import File from "./modules/files/file.entity";
import User from "./modules/users/users.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "user",
  password: "password",
  database: "db",
  synchronize: true,
  logging: true,
  entities: [User, File],
  subscribers: [],
  migrations: [],
});
