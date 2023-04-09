import { postGetAllAction } from "./controller/PostGetAllAction";
import { postGetByIdAction } from "./controller/PostGetByIdAction";
import { postSaveAction } from "./controller/PostSaveAction";
import { register } from "./controller/auth.controller";

/**
 * All application routes.
 */
export const AppRoutes = [
  {
    path: "/signup",
    method: "post",
    action: register,
  },
  {
    path: "/posts",
    method: "get",
    action: postGetAllAction,
  },
  {
    path: "/posts/:id",
    method: "get",
    action: postGetByIdAction,
  },
  {
    path: "/posts",
    method: "post",
    action: postSaveAction,
  },
];
