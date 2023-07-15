import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { BookService } from "./book.service";

const createBook = catchAsync(async (req: Request, res: Response) => {
  const { ...bookData } = req.body;

  const result = await BookService.createBook(bookData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book Created Successfully",
    data: result,
  });
});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getAllBooks();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Get Successfully",
    data: result,
  });
});

export const bookController = {
  createBook,
  getAllBooks,
};
