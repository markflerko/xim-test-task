import "dotenv/config";
import "reflect-metadata";
import App from "./app";
import { AppDataSource } from "./data-source";
import PostsController from "./modules/posts/posts.controller";
import UsersController from "./modules/users/users.controller";

AppDataSource.initialize()
  .then(() => {
    const PORT = +process.env.PORT || 5001;

    const app = new App([new PostsController(), new UsersController()], PORT);
    app.listen();
  })
  .catch((error) => console.log(error));
