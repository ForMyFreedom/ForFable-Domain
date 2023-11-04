import { ApiResponse } from '..'
import { UserEntity } from '../entities'

export type EmailSended = { sended: boolean }

export interface MailUsecase {
  sendUserResetPasswordMail(user: UserEntity): Promise<ApiResponse<EmailSended>>
  sendUserVerificationMail(user: UserEntity):  Promise<ApiResponse<EmailSended>>
}

export interface MailController extends MailUsecase { }
