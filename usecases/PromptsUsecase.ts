import { ApiResponse, Pagination } from '..'
import { GainControlOverDailyPromptInsert, PromptEntity, PromptEntityWithWrite, PromptInsert, UserEntity } from '../entities'

export type PromptTrail = {
  userName: string,
  userId: number,
  proposalText: string
}[]

export interface PromptsUsecase {
  index(page?: number, limit?: number): Promise<Pagination<PromptEntity>>
  indexByAuthor(authorId: UserEntity['id'], page?: number, limit?: number): Promise<Pagination<PromptEntity>>
  getAuthor(promptId: PromptEntity['id']): Promise<ApiResponse<UserEntity>>
  show(promptId: PromptEntity['id']): Promise<ApiResponse<PromptEntityWithWrite>>
  store(authorId: undefined|UserEntity['id'], body: PromptInsert): Promise<ApiResponse<PromptEntity>>
  update(authorId: undefined|UserEntity['id'], promptId: PromptEntity['id'], partialPrompt: Partial<PromptInsert>): Promise<ApiResponse<PromptEntity>>
  destroy(authorId: undefined|UserEntity['id'], promptId: PromptEntity['id']): Promise<ApiResponse<PromptEntity>>
  appropriateDailyPrompt(authorId: undefined|UserEntity['id'], promptId: PromptEntity['id'], body: GainControlOverDailyPromptInsert): Promise<ApiResponse<PromptEntity>>
  trailDefinitives(promptId: PromptEntity['id']): Promise<ApiResponse<PromptTrail>>
}

export interface PromptsController extends Omit<PromptsUsecase,'store'|'update'|'destroy'|'appropriateDailyPrompt'> {
  store(body: PromptInsert): Promise<ApiResponse<PromptEntity>>
  update(promptId: PromptEntity['id'], partialPrompt: Partial<PromptInsert>): Promise<ApiResponse<PromptEntity>>
  destroy(promptId: PromptEntity['id']): Promise<ApiResponse<PromptEntity>>
  appropriateDailyPrompt(promptId: PromptEntity['id'], body: GainControlOverDailyPromptInsert): Promise<ApiResponse<PromptEntity>>
}
