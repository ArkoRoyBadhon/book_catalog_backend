import { Date, Model, Types } from "mongoose";

export type IBook = {
  _id?: Types.ObjectId;
  Title: string;
  Author: string;
  AuthorId: string;
  Genre: string;
  PublicationDate: Date;
  reviews: string[];
};

export type BookModel = Model<IBook, Record<string, unknown>>;
