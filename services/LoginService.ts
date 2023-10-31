import { ApiResponse, BaseHTTPService } from "./BaseHTTPService"
import { AuthWrapper, ExceptionHandler, UserRepository } from "../contracts"
import { LoginUsecase } from "../usecases"
import { UserWithToken } from ".."

export class LoginService extends BaseHTTPService implements LoginUsecase {
  constructor(
    private readonly authWraper: AuthWrapper,
    private readonly userRepository: UserRepository,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  async loginByCredential(identify: string, password: string): Promise<ApiResponse<UserWithToken>> {
    const { token } = await this.authWraper.validateWithCredential(identify, password)

    if (token) {
      const user = await this.userRepository.findByIdentify(identify)
      if(user){
        const response = {user: user, token: token}
        this.exceptionHandler.SuccessfullyAuthenticated(response)
        return { data: response }
      } else {
        this.exceptionHandler.BadRequest()
        return { error: 'BadRequest' }
      }
    } else {
      this.exceptionHandler.Unauthenticated()
      return { error: 'Unauthenticated' }
    }
  }
}
