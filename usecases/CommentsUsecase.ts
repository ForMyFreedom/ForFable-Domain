import { ApiResponse, PaginationData } from "."
import { CommentEntity, CommentInsert, CommentReactionEntity, UserEntity, WriteEntity } from "../entities"

export type CommentWithReactions = CommentEntity & {reactions: CommentReactionEntity[]}

export type CommentsWithAnswers = CommentWithReactions & {answers: CommentEntity[]}

export type WithUsers<T> = T & { users: UserEntity[] } 


export interface CommentsUsecase {
  indexByWrite(writeId: WriteEntity['id'], page?: number, limit?: number): Promise<ApiResponse<WithUsers<PaginationData<CommentsWithAnswers>>>>
  store(user: UserEntity|undefined, body: CommentInsert): Promise<ApiResponse<CommentEntity>>
  update(userId: UserEntity['id']|undefined, commentId: CommentEntity['id'], body: Partial<CommentInsert>): Promise<ApiResponse<CommentEntity>>
  destroy(userId: UserEntity['id']|undefined, commentId: CommentEntity['id']): Promise<ApiResponse<CommentEntity>>
}

export interface CommentsController extends Omit<CommentsUsecase, 'store'|'update'|'destroy'> {
  store(body: CommentInsert): Promise<ApiResponse<CommentEntity>>
  update(commentId: CommentEntity['id'], body: Partial<CommentInsert>): Promise<ApiResponse<CommentEntity>>
  destroy(commentId: CommentEntity['id']): Promise<ApiResponse<CommentEntity>>
}
