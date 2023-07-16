import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { BookService } from "./book.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constant/pagination";
import { bookFilterOptions } from "./book.constant";

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
  const filters = pick(req.query, bookFilterOptions);
  // console.log("filters", filters);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await BookService.getAllBooks(filters, paginationOptions);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Get Successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const authorizationHeader = req.headers["authorization"];
  const id = req.params.id;

  if (typeof authorizationHeader === "string") {
    const token = authorizationHeader.split(" ")[1];
    const deleteInfo = {
      token,
      id,
    };

    const result = await BookService.deleteBook(deleteInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book deleted Successfully",
      data: result,
    });
  }
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const authorizationHeader = req.headers["authorization"];
  const id = req.params.id;

  if (typeof authorizationHeader === "string") {
    const token = authorizationHeader.split(" ")[1];
    const getInfo = {
      token,
      id,
    };

    const result = await BookService.getSingleBook(getInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book retrive Successfully",
      data: result,
    });
  }
});

const updateSingleBook = catchAsync(async (req: Request, res: Response) => {
  const authorizationHeader = req.headers["authorization"];
  const id = req.params.id;
  const bodyData = req.body;

  if (typeof authorizationHeader === "string") {
    const token = authorizationHeader.split(" ")[1];
    const getInfo = {
      id,
      token,
      bodyData,
    };

    const result = await BookService.updateSingleBook(getInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book Updated Successfully",
      data: result,
    });
  }
});

const postReviewBook = catchAsync(async (req: Request, res: Response) => {
  const authorizationHeader = req.headers["authorization"];
  const id = req.params.id;
  const bodyData = req.body;

  if (typeof authorizationHeader === "string") {
    const token = authorizationHeader.split(" ")[1];
    const getInfo = {
      id,
      token,
      data: bodyData?.data,
    };

    const result = await BookService.postReviewBook(getInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review Post Successfully",
      data: result,
    });
  }
});

export const bookController = {
  createBook,
  getAllBooks,
  deleteBook,
  getSingleBook,
  updateSingleBook,
  postReviewBook,
};
