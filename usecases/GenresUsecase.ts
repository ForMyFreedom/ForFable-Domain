
import { ApiResponse, Pagination } from '..'
import { GenreEntity, GenreInsert } from '../entities'

export interface GenresUsecase {
  store(body: GenreInsert): Promise<ApiResponse<GenreEntity>>
  index(page?: number, limit?: number): Promise<Pagination<GenreEntity>>
  show(genreId: GenreEntity['id']): Promise<ApiResponse<GenreEntity>>
  update(genreId: GenreEntity['id'], body: Partial<GenreInsert>): Promise<ApiResponse<GenreEntity>>
  destroy(genreId: GenreEntity['id']): Promise<ApiResponse<GenreEntity>>
  storeWords(genreId: GenreEntity['id'], words: string[]): Promise<ApiResponse<GenreEntity>>
}

export interface GenresController extends GenresUsecase { }
