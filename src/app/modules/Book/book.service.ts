/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IBook } from "./book.interface";
import { Book } from "./book.model";
import { SortOrder } from "mongoose";
import { paginationsHelpers } from "../../../helpers/paginationHelpers";
import { IGenericResponse } from "../../../interfaces/common";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { User } from "../User/user.model";

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
    AuthorId: payload.AuthorId,
  };

  const result = await Book.create(newBook);

  return result;
};

const getAllBooks = async (
  filters: {
    searchTerm?: string | undefined;
    PublicationYear?: string | undefined;
    Genre?: string | undefined;
  },
  paginationOptions: {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: SortOrder | undefined;
  },
): Promise<IGenericResponse<IBook[]>> => {
  const andConditions: string | any[] = [];

  const { searchTerm, PublicationYear, ...filtersData } = filters;

  const bookSearchableFields = ["Title", "Author", "Genre"];

  if (searchTerm!.length > 0) {
    andConditions.push({
      $or: bookSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // if (PublicationYear && PublicationYear!.length !== 0) {
  //   // const startOfYear = new Date(PublicationYear);
  //   // const endOfYear = new Date(PublicationYear);
  //   // endOfYear.setFullYear(endOfYear.getFullYear() + 1);

  //   andConditions.push({
  //     $and: {
  //       PublicationDate: PublicationYear
  //     },
  //   });
  // }

  if (filtersData.Genre!.length > 0) {
    if (Object.keys(filtersData).length) {
      andConditions.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }
  }

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

const deleteBook = async (payload: { token: string; id: string }) => {
  const { token, id } = payload;

  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid access Token");
  }
  const { Id } = verifiedToken;

  const UserIDD = await Book.findOne({ _id: id });

  if (Id === UserIDD?.AuthorId) {
    const result = await Book.findByIdAndDelete({ _id: id });
    return result;
  } else {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not own this book. So you can't delete this book",
    );
  }
};

const getSingleBook = async (payload: { token: string; id: string }) => {
  const { token, id } = payload;

  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid access Token");
  }
  const { Id } = verifiedToken;

  const UserIDD = await Book.findOne({ _id: id });

  if (Id === UserIDD?.AuthorId) {
    const result = UserIDD;
    // console.log(result);

    return result;
  }
};

const updateSingleBook = async (payload: {
  token: string;
  id: string;
  bodyData: Partial<IBook>;
}) => {
  const { id, token, bodyData } = payload;

  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid access Token");
  }
  const { Id } = verifiedToken;

  const book = await Book.findById(id);

  if (book && Id === book.AuthorId) {
    // console.log(bodyData);

    const result = await Book.findByIdAndUpdate(id, bodyData, {
      new: true,
    });
    return result;
  } else {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this book",
    );
  }
};

const postReviewBook = async (payload: {
  token: string;
  id: string;
  data: string;
}) => {
  const { id, token, data } = payload;

  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid access Token");
  }
  const { Id } = verifiedToken;

  if (verifiedToken) {
    const result = await Book.findByIdAndUpdate(id, {
      $push: { reviews: data },
    });

    return result;
  }
};

export const BookService = {
  createBook,
  getAllBooks,
  deleteBook,
  getSingleBook,
  updateSingleBook,
  postReviewBook,
};
