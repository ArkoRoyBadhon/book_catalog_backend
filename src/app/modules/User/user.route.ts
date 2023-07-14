import express from "express";

import { AuthController } from "./user.controller";

const router = express.Router();

router.post("/signup", AuthController.createUser);

// router.post('/login', AuthController.loginUser)
// router.post('/refresh-token', AuthController.refreshToken)

export const AuthUserRoutes = router;
