import { ApiResponse } from "."
import { CleanReactionResponse, CommentEntity, CommentReactionEntity, CommentReactionInsert, UserEntity } from "../entities"

export interface ReactCommentsUsecase {
  show(userId: UserEntity['id']|undefined, commentId: CommentEntity['id']): Promise<ApiResponse<CleanReactionResponse>>
  store(userId: UserEntity['id']|undefined, body: CommentReactionInsert): Promise<ApiResponse<CommentReactionEntity>>
  destroy(userId: UserEntity['id']|undefined, reactCommentId: CommentReactionEntity['id']): Promise<ApiResponse<CommentReactionEntity>>
}

export interface ReactCommentsController extends Omit<ReactCommentsUsecase, 'store'|'destroy'|'show'> {
  show(commentId: CommentEntity['id']): Promise<ApiResponse<CleanReactionResponse>>
  store(body: CommentReactionInsert): Promise<ApiResponse<CommentReactionEntity>>
  destroy(reactCommentId: CommentReactionEntity['id']): Promise<ApiResponse<CommentReactionEntity>>
}
