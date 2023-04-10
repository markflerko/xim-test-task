import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import errorMiddleware from "./middlewares/error.middleware";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeErrorHandling();
    this.initializeControllers(controllers);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.json());
    this.app.use(
      cors({
        credentials: true,
        origin: function (origin, callback) {
          return callback(null, true);
        },
      })
    );
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
