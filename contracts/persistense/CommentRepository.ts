import { PaginationData } from "../../usecases/BaseUsecase"
import { CommentEntity, CommentInsert, UserEntity, WriteEntity } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";
import { CommentWithReactions } from "../../usecases";

type ExtraInfoOnCreate = {
    authorId: UserEntity['id']
}

export interface CommentRepository extends DefaultRepository<CommentInsert, CommentEntity> {
    getByWrite(writeId: WriteEntity['id'], page?: number, limit?: number): Promise<PaginationData<CommentWithReactions>>
    loadAuthors(commentArray: CommentEntity[]): Promise<UserEntity[]>
    create(body: CommentInsert & ExtraInfoOnCreate): Promise<CommentEntity>
}
