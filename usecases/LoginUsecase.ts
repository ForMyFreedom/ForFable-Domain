import { ApiResponse, UserWithToken } from "..";

export interface LoginUsecase {
  loginByCredential(identify: string, password: string): Promise<ApiResponse<UserWithToken>>
}

export interface LoginController extends LoginUsecase { }
