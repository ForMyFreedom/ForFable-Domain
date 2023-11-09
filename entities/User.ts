import { DateTime } from 'luxon'
import { ConstantEntity } from './Constant'

export type UserInsert = PasswordInsert & Pick<UserEntity,
  'name'|'email'|'birthDate'
>

export type UserUpdate = Pick<UserEntity,
  'name'|'nickname'|'primaryColorHex'|'secondaryColorHex'
>

export interface UserEntity {
  id: number
  name: string
  nickname: string
  imageUrl: string | null
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
}

export namespace UserEntity {
  export function verifyBan(user: UserEntity, { banLimit }: ConstantEntity): boolean {
    return banLimit > user.score
  }
  
  export function interactionBanned(user: UserEntity, { deleteStrength }: ConstantEntity): void {
    user.score -= deleteStrength
  }
}

export type UserWithToken = { user: UserEntity, token: string}

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