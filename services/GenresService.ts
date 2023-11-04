
import { BaseHTTPService } from './BaseHTTPService'
import { ApiResponse, Pagination } from "../usecases/BaseUsecase"
import { GenreEntity, GenreInsert } from '../entities'
import { ThematicWordRepository, ResponseHandler, GenresRepository } from '../contracts'
import { GenresUsecase } from '../usecases'

export class GenresService extends BaseHTTPService implements GenresUsecase {
  constructor(
    private readonly genreRepository: GenresRepository,
    private readonly thematicWordRepository: ThematicWordRepository,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  public async store(body: GenreInsert): Promise<ApiResponse<GenreEntity>> {
    const { thematicWords, ...rest } = body
    const genre = await this.genreRepository.create(rest)
    await this.storeWordsToGenre(thematicWords, genre)
    return this.responseHandler.SucessfullyCreated(genre)
  }

  public async index(page?: number, limit?: number): Promise<Pagination<GenreEntity>> {
    const response = await this.genreRepository.loadGenresWithWords(page, limit)
    return this.responseHandler.SucessfullyRecovered(response)
  }

  public async show(genreId: GenreEntity['id']): Promise<ApiResponse<GenreEntity>> {
    const genre = await this.genreRepository.find(genreId)
    if (!genre) {
      return this.responseHandler.UndefinedId<object>()
    } else {
      return this.responseHandler.SucessfullyRecovered(genre)
    }
  }

  public async update(genreId: GenreEntity['id'], body: Partial<GenreInsert>): Promise<ApiResponse<GenreEntity>> {
    const { thematicWords, ...rest } = body

    const genre = await this.genreRepository.find(genreId)
    if (!genre) {
      return this.responseHandler.UndefinedId<object>()
    } else {
      await this.genreRepository.update(genreId, rest)

      if (thematicWords) {
        await this.genreRepository.eraseAllWordsFromGenre(genre)
        await this.storeWordsToGenre(thematicWords, genre)
      }

      return this.responseHandler.SucessfullyUpdated(genre)
    }
  }

  public async destroy(genreId: GenreEntity['id']): Promise<ApiResponse<GenreEntity>> {
    const genre = await this.genreRepository.find(genreId)
    if (!genre) {
      return this.responseHandler.UndefinedId<object>()
    } else {
      await this.genreRepository.delete(genreId)
      return this.responseHandler.SucessfullyDestroyed(genre)
    }
  }

  public async storeWords(genreId: GenreEntity['id'], words: string[]): Promise<ApiResponse<GenreEntity>> {
    const genre = await this.genreRepository.find(genreId)

    if (!genre) {
      return this.responseHandler.UndefinedId<object>()
    } else {
      await this.storeWordsToGenre(words, genre)
      const updatedGenre = await this.genreRepository.find(genreId)
      return this.responseHandler.SucessfullyCreated(updatedGenre)
    }
  }

  async storeWordsToGenre(thematicWords: string[], genre: GenreEntity): Promise<void> {
    for (const word of thematicWords) {
      if (!(await this.genreRepository.wordAlreadyInGenre(word, genre.id))) {
        await this.thematicWordRepository.create({ text: word, genreId: genre.id })
      }
    }
  }

}
