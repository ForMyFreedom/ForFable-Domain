import { EmailSended } from "../../usecases";
import { TokenEntity, UserEntity } from "../../entities";

export interface MailSender {
    sendUserRequestPasswordMail(user: UserEntity, token: TokenEntity): Promise<EmailSended>
    sendUserVerificationMail(user: UserEntity, token: TokenEntity): Promise<EmailSended>
}