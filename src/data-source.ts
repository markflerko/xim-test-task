import { DataSource } from "typeorm";
import { Category } from "./entity/Category";
import { Post } from "./entity/Post";
import { User } from "./entity/User";
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "user",
  password: "password",
  database: "db",
  synchronize: true,
  logging: true,
  entities: [Post, Category, User],
  subscribers: [],
  migrations: [],
});
