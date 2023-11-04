import { BaseHTTPService } from './BaseHTTPService'
import { ApiResponse } from "../usecases/BaseUsecase"
import { MailSender, ResponseHandler, TokenRepository } from '../contracts'
import { UserEntity } from '../entities'
import { EmailSended, MailUsecase } from '../usecases'

export class MailService extends BaseHTTPService implements MailUsecase {
  constructor(
    private readonly mailSender: MailSender,
    private readonly tokenRepository: TokenRepository,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  public async sendUserResetPasswordMail(user: UserEntity): Promise<ApiResponse<EmailSended>> {
    const token = await this.tokenRepository.create(user, 'reset_password')
    return { data: await this.mailSender.sendUserRequestPasswordMail(user, token) }
  }

  public async sendUserVerificationMail(user: UserEntity): Promise<ApiResponse<EmailSended>> {
    const token = await this.tokenRepository.create(user, 'email_verification')
    return { data: await this.mailSender.sendUserVerificationMail(user, token) }
  }
}

