/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IBook } from "./book.interface";
import { Book } from "./book.model";
import { SortOrder } from "mongoose";
import { paginationsHelpers } from "../../../helpers/paginationHelpers";
import { IGenericResponse } from "../../../interfaces/common";

const createBook = async (payload: IBook): Promise<Partial<IBook>> => {
  const existingBook = await Book.findOne({
    Title: payload.Title,
    Author: payload.Author,
    Genre: payload.Genre,
  });

  if (existingBook) {
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      "Duplicate entry not allowed",
    );
  }

  const newBook = {
    Title: payload.Title,
    Author: payload.Author,
    Genre: payload.Genre,
    PublicationDate: new Date(),
  };

  const result = await Book.create(newBook);

  return result;
};

const getAllBooks = async (
  filters: any,
  paginationOptions: {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: SortOrder | undefined;
  },
): Promise<IGenericResponse<IBook[]>> => {
  const andConditions: string | any[] = [];

  const { page, limit, skip, sortBy, sortOrder } =
    paginationsHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions).sort(sortConditions);

  const count = await Book.find({}).count();

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

export const BookService = {
  createBook,
  getAllBooks,
};
