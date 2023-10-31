import { BaseHTTPService } from "./BaseHTTPService"
import { AuthWrapper, ExceptionHandler, UserRepository } from "../contracts"
import { LoginUsecase } from "for-fable-domain/usecases"

export class LoginService extends BaseHTTPService implements LoginUsecase {
  constructor(
    private readonly authWraper: AuthWrapper,
    private readonly userRepository: UserRepository,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  async loginByCredential(identify: string, password: string): Promise<void> {
    const { token } = await this.authWraper.validateWithCredential(identify, password)

    if (token) {
      const user = await this.userRepository.findByIdentify(identify)
      if(user){
        this.exceptionHandler.SuccessfullyAuthenticated(
          {user: user, token: token}
        )
      } else {
        this.exceptionHandler.BadRequest()
      }
    } else {
      this.exceptionHandler.Unauthenticated()
    }
  }
}
