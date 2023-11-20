import { ApiResponse, PaginationData } from "."
import { CommentEntity, CommentInsert, UserEntity, WriteEntity } from "../entities"

export type EstruturatedCommentsWithAnswers = {
  comment: Partial<CommentEntity>,
  answers: Partial<CommentEntity>[],
}

export type WithUsers<T> = T & { users: UserEntity[] } 


export interface CommentsUsecase {
  indexByWrite(writeId: WriteEntity['id'], page?: number, limit?: number): Promise<ApiResponse<WithUsers<PaginationData<EstruturatedCommentsWithAnswers>>>>
  store(user: UserEntity|undefined, body: CommentInsert): Promise<ApiResponse<CommentEntity>>
  update(userId: UserEntity['id']|undefined, commentId: CommentEntity['id'], body: Partial<CommentInsert>): Promise<ApiResponse<CommentEntity>>
  destroy(userId: UserEntity['id']|undefined, commentId: CommentEntity['id']): Promise<ApiResponse<CommentEntity>>
}

export interface CommentsController extends Omit<CommentsUsecase, 'store'|'update'|'destroy'> {
  store(body: CommentInsert): Promise<ApiResponse<CommentEntity>>
  update(commentId: CommentEntity['id'], body: Partial<CommentInsert>): Promise<ApiResponse<CommentEntity>>
  destroy(commentId: CommentEntity['id']): Promise<ApiResponse<CommentEntity>>
}
