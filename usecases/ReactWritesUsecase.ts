import { ApiResponse } from '..'
import { ExibitionReaction, UserEntity, WriteEntity, WriteReactionEntity, WriteReactionInsert } from '../entities'

export interface ReactWritesUsecase {
  show(writeId: WriteEntity['id']): Promise<ApiResponse<ExibitionReaction[]>>
  store(userId: UserEntity['id']|undefined, body: WriteReactionInsert): Promise<ApiResponse<WriteReactionEntity>>
  destroy(userId: UserEntity['id']|undefined, reactionId: WriteReactionEntity['id']): Promise<ApiResponse<WriteReactionEntity>>
}

export interface ReactWritesController extends Omit<ReactWritesUsecase, 'store'|'destroy'> {
  store(body: WriteReactionInsert): Promise<ApiResponse<WriteReactionEntity>>
  destroy(reactionId: WriteReactionEntity['id']): Promise<ApiResponse<WriteReactionEntity>>
}


