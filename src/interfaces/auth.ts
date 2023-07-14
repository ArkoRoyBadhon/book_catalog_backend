export type ILoginAllUser = {
  phoneNumber: string;
  password: string;
};

export type ILoginAllUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenresponse = {
  accessToken: string;
};
