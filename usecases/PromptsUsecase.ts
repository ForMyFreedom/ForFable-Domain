import { GainControlOverDailyPromptInsert, PromptEntity, PromptInsert, UserEntity } from '../entities'

export interface PromptsUsecase {
  index(): Promise<void>
  show(promptId: PromptEntity['id']): Promise<void>
  store(authorId: undefined|UserEntity['id'], body: PromptInsert): Promise<void>
  update(authorId: undefined|UserEntity['id'], promptId: PromptEntity['id'], partialPrompt: Partial<PromptInsert>): Promise<void>
  destroy(authorId: undefined|UserEntity['id'], promptId: PromptEntity['id']): Promise<void>
  appropriateDailyPrompt(authorId: undefined|UserEntity['id'], promptId: PromptEntity['id'], body: GainControlOverDailyPromptInsert): Promise<void>
}

export interface PromptsController extends Omit<PromptsUsecase,'store'|'update'|'destroy'> {
  store(body: PromptInsert): Promise<void>
  update(promptId: PromptEntity['id'], partialPrompt: Partial<PromptInsert>): Promise<void>
  destroy(promptId: PromptEntity['id']): Promise<void>
}
