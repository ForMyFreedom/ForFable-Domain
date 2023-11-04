import { Pagination } from "../..";
import { GenreEntity, GenreInsert, ThematicWordEntity } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

export interface GenresRepository extends DefaultRepository<GenreInsert, GenreEntity> {
    create(body: Omit<GenreInsert, 'thematicWords'>): Promise<GenreEntity>
    loadGenresWithWords(page?: number, limit?: number): Promise<Pagination<GenreEntity>['data']>
    eraseAllWordsFromGenre(genre: GenreEntity): Promise<void>
    wordAlreadyInGenre(word: string, genreId: GenreEntity['id']): Promise<boolean>
    getThematicWords(genre: GenreEntity|GenreEntity['id']): Promise<ThematicWordEntity[]>
}
