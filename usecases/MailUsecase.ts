import { GenericResponse } from '..'
import { UserEntity } from '../entities'


export interface MailUsecase {
  sendUserResetPasswordMail(user: UserEntity): Promise<GenericResponse>
  sendUserVerificationMail(user: UserEntity):  Promise<GenericResponse>
}

export interface MailController extends MailUsecase { }
