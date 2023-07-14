import { Model, Types } from "mongoose";

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IUserRoleFields = "admin" | "user";

export type IUser = {
  _id?: Types.ObjectId;
  role: IUserRoleFields;
  password: string;
  email: string;
  name: UserName;
};

// export type UserModel = Model<IUser, Record<string, unknown>>

export type UserModel = {
  isUserExist(
    userId: string,
  ): Promise<Pick<IUser, "_id" | "email" | "role" | "password">>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
