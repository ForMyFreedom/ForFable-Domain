import { ApiResponse, Pagination } from ".."
import { ProposalEntity, PromptEntity, UserEntity, ProposalInsert } from "../entities"

export interface ProposalsUsecase {
  indexByPrompt(promptId: PromptEntity['id'], page?: number, limit?: number): Promise<Pagination<ProposalEntity>>
  actualIndexByPrompt(promptId: PromptEntity['id']): Promise<Pagination<ProposalEntity>>
  indexByAuthor(authorId: UserEntity['id'], page?: number, limit?: number): Promise<Pagination<ProposalEntity>>
  show(proposalId: ProposalEntity['id']): Promise<ApiResponse<ProposalEntity>>
  store(userId: UserEntity['id']|undefined, body: ProposalInsert ): Promise<ApiResponse<ProposalEntity>>
  update(userId: UserEntity['id']|undefined, proposalId: ProposalEntity['id'], partialBody: Partial<ProposalInsert>): Promise<ApiResponse<ProposalEntity>>
  destroy(userId: UserEntity['id']|undefined, proposalId: ProposalEntity['id']): Promise<ApiResponse<ProposalEntity>>
}

export interface ProposalsController extends Omit<ProposalsUsecase, 'store'|'update'|'destroy'> {
  store(body: ProposalInsert ): Promise<ApiResponse<ProposalEntity>>
  update(proposalId: ProposalEntity['id'], partialBody: Partial<ProposalInsert>): Promise<ApiResponse<ProposalEntity>>
  destroy(proposalId: ProposalEntity['id']): Promise<ApiResponse<ProposalEntity>>
}
