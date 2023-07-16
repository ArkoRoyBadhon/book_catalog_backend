import express from "express";

import { bookController } from "./book.controller";

const router = express.Router();

router.post("/createbook", bookController.createBook);
router.get("/getallbooks", bookController.getAllBooks);

router.get("/getbook/:id", bookController.getSingleBook);
router.delete("/deletebook/:id", bookController.deleteBook);
router.patch("/updatebook/:id", bookController.updateSingleBook);
router.patch("/postReview/:id", bookController.postReviewBook);

export const BookRoutes = router;
