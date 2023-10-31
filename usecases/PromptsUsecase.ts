import { ApiResponse, Pagination } from '..'
import { GainControlOverDailyPromptInsert, PromptEntity, PromptInsert, UserEntity } from '../entities'

export interface PromptsUsecase {
  index(): Promise<Pagination<PromptEntity>>
  show(promptId: PromptEntity['id']): Promise<ApiResponse<PromptEntity>>
  store(authorId: undefined|UserEntity['id'], body: PromptInsert): Promise<ApiResponse<PromptEntity>>
  update(authorId: undefined|UserEntity['id'], promptId: PromptEntity['id'], partialPrompt: Partial<PromptInsert>): Promise<ApiResponse<PromptEntity>>
  destroy(authorId: undefined|UserEntity['id'], promptId: PromptEntity['id']): Promise<ApiResponse<PromptEntity>>
  appropriateDailyPrompt(authorId: undefined|UserEntity['id'], promptId: PromptEntity['id'], body: GainControlOverDailyPromptInsert): Promise<ApiResponse<PromptEntity>>
}

export interface PromptsController extends Omit<PromptsUsecase,'store'|'update'|'destroy'|'appropriateDailyPrompt'> {
  store(body: PromptInsert): Promise<ApiResponse<PromptEntity>>
  update(promptId: PromptEntity['id'], partialPrompt: Partial<PromptInsert>): Promise<ApiResponse<PromptEntity>>
  destroy(promptId: PromptEntity['id']): Promise<ApiResponse<PromptEntity>>
  appropriateDailyPrompt(promptId: PromptEntity['id'], body: GainControlOverDailyPromptInsert): Promise<ApiResponse<PromptEntity>>
}
