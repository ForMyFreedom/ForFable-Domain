import { UserEntity } from "./User"

export type TokenInsert = Pick<TokenEntity, 'userId'|'type'>

export interface TokenEntity {
  id: number
  token: string
  userId: UserEntity['id']
  type: string
}
