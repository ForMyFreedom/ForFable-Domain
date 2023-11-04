import { DateTime } from 'luxon'
import { WriteEntity } from './Write'
import { UserEntity } from './User'
import { InteractionEntity } from './_Base'

export type CommentInsert = Pick<CommentEntity, 
  'writeId'|'answerToId'|'text'|'imageUrl'
>

export interface CommentEntity extends InteractionEntity {
  id: number
  writeId: WriteEntity['id']
  authorId: UserEntity['id']
  answerToId: CommentEntity['id'] | null
  imageUrl: string | null
  text: string
  edited: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
