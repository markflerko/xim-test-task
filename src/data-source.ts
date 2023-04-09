import { DataSource } from "typeorm";
import { Post } from "./modules/posts/posts.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "user",
  password: "password",
  database: "db",
  synchronize: true,
  logging: true,
  entities: [Post],
  subscribers: [],
  migrations: [],
});
