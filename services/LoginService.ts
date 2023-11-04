import { BaseHTTPService } from "./BaseHTTPService"
import { ApiResponse } from "../usecases/BaseUsecase"
import { AuthWrapper, ResponseHandler, UserRepository } from "../contracts"
import { LoginUsecase } from "../usecases"
import { UserWithToken } from ".."

export class LoginService extends BaseHTTPService implements LoginUsecase {
  constructor(
    private readonly authWraper: AuthWrapper,
    private readonly userRepository: UserRepository,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  async loginByCredential(identify: string, password: string): Promise<ApiResponse<UserWithToken>> {
    const { token } = await this.authWraper.validateWithCredential(identify, password)

    if (token) {
      const user = await this.userRepository.findByIdentify(identify)
      if(user){
        const response = {user: user, token: token}
        return this.responseHandler.SuccessfullyAuthenticated(response)
      } else {
        return this.responseHandler.BadRequest()
      }
    } else {
      return this.responseHandler.Unauthenticated()
    }
  }
}
