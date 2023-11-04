import { Pagination } from "../../usecases/BaseUsecase"
import { CommentEntity, CommentInsert, UserEntity, WriteEntity } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

type ExtraInfoOnCreate = {
    authorId: UserEntity['id']
}

export interface CommentRepository extends DefaultRepository<CommentInsert, CommentEntity> {
    getByWrite(writeId: WriteEntity['id'], page?: number, limit?: number): Promise<Pagination<CommentEntity>>
    loadAuthors(commentArray: CommentEntity[]): Promise<UserEntity[]>
    create(body: CommentInsert & ExtraInfoOnCreate): Promise<CommentEntity>
}
