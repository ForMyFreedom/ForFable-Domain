import { BaseHTTPService } from './BaseHTTPService'
import { GenericResponse } from "../usecases/BaseUsecase"
import { MailSender, ResponseHandler, TokenRepository } from '../contracts'
import { UserEntity } from '../entities'
import { MailUsecase } from '../usecases'

export class MailService extends BaseHTTPService implements MailUsecase {
  constructor(
    private readonly mailSender: MailSender,
    private readonly tokenRepository: TokenRepository,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  public async sendUserResetPasswordMail(user: UserEntity): Promise<GenericResponse> {
    const token = await this.tokenRepository.create(user, 'reset_password')
    return { state: await this.mailSender.sendUserRequestPasswordMail(user, token) ? 'Sucess' : 'Failure' }
  }

  public async sendUserVerificationMail(user: UserEntity): Promise<GenericResponse> {
    const token = await this.tokenRepository.create(user, 'email_verification')
    return { state: await this.mailSender.sendUserVerificationMail(user, token) ? 'Sucess' : 'Failure' }
  }
}

