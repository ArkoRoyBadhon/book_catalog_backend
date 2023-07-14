export type ILoginAllUser = {
  email: string;
  password: string;
};

export type ILoginAllUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenresponse = {
  accessToken: string;
};
