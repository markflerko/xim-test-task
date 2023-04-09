import * as bodyParser from "body-parser";
import * as express from "express";
import { Request, Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { AppRoutes } from "./routes";

AppDataSource.initialize()
  .then(() => {
    const app = express();
    app.use(bodyParser.json());

    AppRoutes.forEach((route) => {
      app[route.method](
        route.path,
        (request: Request, response: Response, next: Function) => {
          route
            .action(request, response)
            .then(() => next)
            .catch((err) => next(err));
        }
      );
    });

    app.listen(3000);

    console.log("Express application is up and running on port 3000");
  })
  .catch((error) => console.log(error));
