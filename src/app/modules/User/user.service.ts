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
    role: payload?.role,
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
  const { phoneNumber, password } = payload;

  const NormalUser = await User.findOne({ phoneNumber });

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
  const { _id: Id, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { Id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { Id, role },
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

  console.log(Id);
  console.log(verifiedToken);

  const isUserExist = await User.isUserExist(Id);
  console.log("exist", isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      _id: isUserExist._id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
};
