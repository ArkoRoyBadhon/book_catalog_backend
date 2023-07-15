import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IBook } from "./book.interface";
import { Book } from "./book.model";

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

const getAllBooks = async (): Promise<Partial<IBook[]>> => {
  const result = await Book.find({});

  return result;
};

export const BookService = {
  createBook,
  getAllBooks,
};
