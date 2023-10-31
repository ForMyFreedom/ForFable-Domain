
export interface LoginUsecase {
  loginByCredential(identify: string, password: string): Promise<void>
}

export interface LoginController extends LoginUsecase { }
