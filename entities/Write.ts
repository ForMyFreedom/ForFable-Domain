import { DateTime } from 'luxon'
import { InteractionEntity } from './_Base'

export type WriteInsert = Pick<WriteEntity, 'text'|'authorId'>

export interface WriteEntity extends InteractionEntity {
  id: number
  text: string
  edited: boolean
  authorId: number | null // Some Writes may be created by the system, like the Daily Prompts
  createdAt: DateTime
  updatedAt: DateTime
}
