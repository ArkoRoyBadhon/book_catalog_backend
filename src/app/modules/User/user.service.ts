import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IUser } from "../User/user.interface";
import { User } from "../User/user.model";
import {
  ILoginAllUser,
  ILoginAllUserResponse,
  IRefreshTokenresponse,
} from "../../../interfaces/auth";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";
import config from "../../../config";

const createUser = async (payload: IUser): Promise<Partial<IUser>> => {
  const existingUser = await User.findOne({
    "name.firstName": payload.name.firstName,
    "name.lastName": payload.name.lastName,
    email: payload.email,
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      "Duplicate entry not allowed",
    );
  }

  const result = await User.create(payload);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...otherData } = result.toObject();

  return otherData;
};

const loginUser = async (
  payload: ILoginAllUser,
): Promise<ILoginAllUserResponse> => {
  const { email, password } = payload;

  const NormalUser = await User.findOne({ email });

  const id = NormalUser?.id;

  const isUserExist = await User.isUserExist(id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  // create access token & refresh token
  const { _id: Id } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { Id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { Id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenresponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }
  const { Id } = verifiedToken;

  const isUserExist = await User.isUserExist(Id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      _id: isUserExist._id,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const getLoggedUser = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid access Token");
  }
  const { Id } = verifiedToken;

  const isUserExist = await User.isUserExist(Id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const result = await User.findOne({ _id: Id });

  return result;
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
  getLoggedUser,
};
