import express from "express";

import { bookController } from "./book.controller";

const router = express.Router();

router.post("/", bookController.createBook);

export const BookRoutes = router;
