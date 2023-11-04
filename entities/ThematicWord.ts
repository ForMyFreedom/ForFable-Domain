import { DateTime } from 'luxon'
import { GenreEntity } from './Genre'

export type ThematicWordInsert = {
  words: string[]
} & Pick<ThematicWordEntity, 'genreId'>

export interface ThematicWordEntity {
  id: number
  text: string
  genreId: GenreEntity['id']
  createdAt: DateTime
  updatedAt: DateTime
}
