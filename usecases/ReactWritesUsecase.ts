import { ApiResponse } from '..'
import { UserEntity, WriteEntity, WriteReactionEntity, WriteReactionInsert } from '../entities'

export interface ReactWritesUsecase {
  show(writeId: WriteEntity['id']): Promise<ApiResponse<WriteReactionEntity>>
  store(userId: UserEntity['id']|undefined, body: WriteReactionInsert): Promise<ApiResponse<WriteReactionEntity>>
  destroy(userId: UserEntity['id']|undefined, reactionId: WriteReactionEntity['id']): Promise<ApiResponse<WriteReactionEntity>>
}

export interface ReactWritesController extends ReactWritesUsecase { }


