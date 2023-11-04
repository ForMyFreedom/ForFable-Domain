import { DateTime } from 'luxon'

export type GenreInsert = {
  thematicWords: string[]
} & Pick<GenreEntity, 'name'|'imageUrl'>

export interface GenreEntity {
  id: number
  name: string
  imageUrl: string
  popularity: number // Amount of Prompts per day
  createdAt: DateTime
  updatedAt: DateTime
}

export namespace GenreEntity {
  export async function calculateGenrePopularity(genre: GenreEntity, amountOfNonDailyPrompts: number): Promise<void> {
    const startDate = genre.createdAt
    const actualDate = DateTime.now()
    const daysOfExistence = startDate.diff(actualDate).days
  
    genre.popularity = amountOfNonDailyPrompts / (daysOfExistence + 1)
  }
}