import { TokenEntity, UserEntity } from "../../entities";

export interface MailSender {
    sendUserRequestPasswordMail(user: UserEntity, token: TokenEntity): Promise<boolean>
    sendUserVerificationMail(user: UserEntity, token: TokenEntity): Promise<boolean>
}