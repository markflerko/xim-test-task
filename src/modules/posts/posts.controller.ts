import * as express from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Post } from "./posts.entity";

class PostsController {
  public path = "/posts";
  public router = express.Router();
  public postRepository: Repository<Post>;

  constructor() {
    this.initializeRoutes();
    this.initializeRepository();
  }

  public initializeRepository() {
    this.postRepository = AppDataSource.manager.getRepository(Post);
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
  }

  private getAllPosts = (
    request: express.Request,
    response: express.Response
  ) => {
    this.postRepository.find().then((posts) => {
      response.send(posts);
    });
  };
}

export default PostsController;
