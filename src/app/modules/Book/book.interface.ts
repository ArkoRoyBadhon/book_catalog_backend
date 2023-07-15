import { Date, Model, Types } from "mongoose";

export type IBook = {
  _id?: Types.ObjectId;
  Title: string;
  Author: string;
  Genre: string;
  PublicationDate: Date;
};

export type BookModel = Model<IBook, Record<string, unknown>>;
