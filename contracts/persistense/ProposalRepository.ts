import { Pagination } from "../../usecases/BaseUsecase"
import { ProposalInsert, ProposalEntity, WriteEntity, PromptEntity } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

type ExtraInfoOnCreate = {
    writeId: WriteEntity['id']
    orderInHistory: PromptEntity['currentIndex']
}

type ExtraInfoOnUpdate = {
  definitive?: boolean
}

export interface ProposalRepository
    extends DefaultRepository<Omit<ProposalInsert, 'text'>, ProposalEntity> {
      create(body: Omit<ProposalInsert, 'text'> & ExtraInfoOnCreate): Promise<ProposalEntity>
      update(entityId: ProposalEntity['id'], partialBody: Partial<ProposalInsert> & ExtraInfoOnUpdate): Promise<ProposalEntity|null>
      fullFind(proposalId: ProposalEntity['id']): Promise<ProposalEntity|null>
      getProposalsByPrompt(promptId: PromptEntity['id'], page?: number, limit?: number): Promise<Pagination<ProposalEntity>['data']>
      getProposalsByAuthor(authorId: number, page?: number, limit?: number): Promise<Pagination<ProposalEntity>['data']>
      getIndexedProposalsByPrompt(promptId: PromptEntity['id'], index: number, page?: number, limit?: number): Promise<Pagination<ProposalEntity>['data']>
      findByWriteId(writeId: WriteEntity['id']): Promise<ProposalEntity | null>
      getAmountOfConclusiveReactions(proposal: ProposalEntity): Promise<number>
      getWrite(proposal: ProposalEntity): Promise<WriteEntity>
    }
