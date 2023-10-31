import { PasswordInsert, UserEntity, UserInsert } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

type ExtraInfoOnCreate = {
    isAdmin: boolean
    emailVerified: UserEntity['emailVerified']
}

export interface UserRepository extends DefaultRepository<UserInsert, UserEntity> {
    create(body: UserInsert & ExtraInfoOnCreate): Promise<UserEntity>
    isNeedToVerifyEmail(): Promise<boolean>
    findByIdentify(identify: string): Promise<UserEntity|null>
    passwordIsValid(body: PasswordInsert): Promise<{errors?: string[]}>
}

export interface AuthWrapper {
    validateWithCredential(identify: string, password: string): Promise<{token: string|undefined}>
}
