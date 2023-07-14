import express from "express";
import { AuthUserRoutes } from "../modules/User/user.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthUserRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
