import { WriteInsert, WriteEntity } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

export interface WriteRepository extends DefaultRepository<WriteInsert, WriteEntity> {
    getAuthorName(writeId: WriteEntity['id']): Promise<string>
}
