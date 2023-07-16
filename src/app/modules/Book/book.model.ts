/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from "mongoose";
import { BookModel, IBook } from "./book.interface";

const BookSchema = new Schema<IBook, BookModel>(
  {
    Title: {
      type: String,
      required: true,
    },
    Author: {
      type: String,
      required: true,
    },
    AuthorId: {
      type: String,
      required: true,
    },
    Genre: {
      type: String,
      required: true,
    },
    PublicationDate: {
      type: Date,
      required: true,
    },
    reviews: {
      type: [String],
      // required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Book = model<IBook, BookModel>("Book", BookSchema);
