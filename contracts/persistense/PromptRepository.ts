import { PaginationData } from "../../usecases/BaseUsecase";
import { PromptInsert, PromptEntity, GenreEntity, WriteEntity, PromptEntityWithWrite, UserEntity, ProposalWithWrite } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

type ExtraInfoOnCreate = {
    writeId: WriteEntity['id'],
    isDaily?: boolean
}

export interface PromptRepository extends DefaultRepository<PromptInsert & ExtraInfoOnCreate, PromptEntity> {
    find(promptId: PromptEntity['id']): Promise<PromptEntityWithWrite|null>
    create(body: Omit<PromptInsert, 'text'|'genreIds'> & ExtraInfoOnCreate): Promise<PromptEntity>
    removeAllGenresFromPrompt(prompt: PromptEntity): Promise<void>
    setGenresInPrompt(prompt: PromptEntity, genreIds: GenreEntity['id'][]): Promise<boolean>
    promptIsConcluded(promptId: PromptEntity['id']): Promise<boolean>
    findByWriteId(writeId: WriteEntity['id']): Promise<PromptEntity | null>
    findAllByAuthor(authorId: number, page?: number, limit?: number): Promise<PaginationData<PromptEntity>>
    getAllDailyPrompt(): Promise<PromptEntity[]>
    getProposals(prompt: PromptEntity|PromptEntity['id']): Promise<ProposalWithWrite[]>
    getWrite(prompt: PromptEntity|PromptEntity['id']): Promise<WriteEntity|null>
    getAuthor(prompt: PromptEntity|PromptEntity['id']): Promise<UserEntity|null>
}

