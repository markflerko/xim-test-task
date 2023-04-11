import "dotenv/config";
import "reflect-metadata";
import App from "./app";
import { AppDataSource } from "./data-source";
import AuthController from "./modules/auth/auth.controller";
import FilesController from "./modules/files/files.controller";

AppDataSource.initialize()
  .then(() => {
    const PORT = +process.env.PORT || 5001;

    const app = new App([new AuthController(), new FilesController()], PORT);
    app.listen();
  })
  .catch((error) => console.log(error));
