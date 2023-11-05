import { ApiResponse } from "."
import { CommentEntity, CommentReactionEntity, CommentReactionInsert, ExibitionReaction, UserEntity } from "../entities"

export interface ReactCommentsUsecase {
  show(commentId: CommentEntity['id']): Promise<ApiResponse<ExibitionReaction[]>>
  store(userId: UserEntity['id']|undefined, body: CommentReactionInsert): Promise<ApiResponse<CommentReactionEntity>>
  destroy(userId: UserEntity['id']|undefined, reactCommentId: CommentReactionEntity['id']): Promise<ApiResponse<CommentReactionEntity>>
}

export interface ReactCommentsController extends Omit<ReactCommentsUsecase, 'store'|'destroy'> {
  store(body: CommentReactionInsert): Promise<ApiResponse<CommentReactionEntity>>
  destroy(reactCommentId: CommentReactionEntity['id']): Promise<ApiResponse<CommentReactionEntity>>
}
