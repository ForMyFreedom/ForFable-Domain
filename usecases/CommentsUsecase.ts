import { CommentEntity, CommentInsert, UserEntity, WriteEntity } from "../entities"


export interface CommentsUsecase {
  indexByWrite(writeId: WriteEntity['id']): Promise<void>
  store(user: UserEntity|undefined, body: CommentInsert): Promise<void>
  update(userId: UserEntity['id']|undefined, commentId: CommentEntity['id'], body: Partial<CommentInsert>): Promise<void>
  destroy(userId: UserEntity['id']|undefined, commentId: CommentEntity['id']): Promise<void>
}

export interface CommentsController extends CommentsUsecase { }
