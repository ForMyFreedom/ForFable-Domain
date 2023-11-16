import { ApiResponse } from '..'
import { CleanReactionResponse, UserEntity, WriteEntity, WriteReactionEntity, WriteReactionInsert } from '../entities'

export interface ReactWritesUsecase {
  show(userId: UserEntity['id']|undefined, writeId: WriteEntity['id']): Promise<ApiResponse<CleanReactionResponse>>
  store(userId: UserEntity['id']|undefined, body: WriteReactionInsert): Promise<ApiResponse<WriteReactionEntity>>
  destroy(userId: UserEntity['id']|undefined, writeId: WriteEntity['id']): Promise<ApiResponse<WriteReactionEntity>>
}

export interface ReactWritesController extends Omit<ReactWritesUsecase, 'store'|'destroy'|'show'> {
  show(writeId: WriteEntity['id']): Promise<ApiResponse<CleanReactionResponse>>
  store(body: WriteReactionInsert): Promise<ApiResponse<WriteReactionEntity>>
  destroy(writeId: WriteEntity['id']): Promise<ApiResponse<WriteReactionEntity>>
}


