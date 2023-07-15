import express from "express";
import { AuthUserRoutes } from "../modules/User/user.route";
import { BookRoutes } from "../modules/Book/book.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthUserRoutes,
  },
  {
    path: "/book",
    route: BookRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
