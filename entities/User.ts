import { DateTime } from 'luxon'
import { ConstantEntity } from './Constant'

export type UserInsert = PasswordInsert & Pick<UserEntity,
  'name'|'email'|'imageUrl'|'birthDate'
>

export type UserUpdate = Pick<UserEntity,
  'name'|'imageUrl'|'nickname'|'primaryColorHex'|'secondaryColorHex'
>

export abstract class UserEntity {
  id: number
  name: string
  nickname: string
  imageUrl: string
  isAdmin: boolean
  isPremium: boolean
  email: string
  emailVerified: boolean
  primaryColorHex: string
  secondaryColorHex: string
  score: number
  birthDate: DateTime
  password: string
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime

  abstract softDelete(): Promise<void>
  abstract verifyBan(): Promise<void>
  abstract interactionBanned(): Promise<void>

  public static async verifyBan(user: UserEntity, { banLimit }: ConstantEntity): Promise<void> {
    if (banLimit > user.score){
      console.log(`The User ${user.id} was banned!`)
      user.softDelete()
    }
  }

  public static async interactionBanned(user: UserEntity, { deleteStrength }: ConstantEntity): Promise<void> {
    user.score -= deleteStrength
  }
}

export type PasswordInsert = {
  password: string
  repeatPassword: string
}

export type LoginWithCredentialInsert = {
  identify: string // name or email
  password: string
}

export type LoginWithTokenInsert = {
  token: string
}

export type RestartPasswordInsert = PasswordInsert