import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AuthService } from "./user.service";
import config from "../../../config";
import { ILoginAllUserResponse } from "../../../interfaces/auth";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;

  const result = await AuthService.createUser(userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Created Successfully",
    data: result,
  });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const authorizationHeader = req.headers["authorization"];

  if (typeof authorizationHeader === "string") {
    const token = authorizationHeader.split(" ")[1];
    console.log(token);
    const result = await AuthService.getLoggedUser(token);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Created Successfully",
      data: result,
    });
  }
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<ILoginAllUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: "User logged In successfully !",
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<ILoginAllUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: "User logged In successfully !",
    data: result,
  });
});

export const AuthController = {
  createUser,
  getUser,
  loginUser,
  refreshToken,
};
