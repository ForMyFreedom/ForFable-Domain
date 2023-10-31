import { Pagination } from "for-fable-domain/services"

export interface DefaultRepository<TInsert, TEntity extends { id: number }> {
    find(entityId: TEntity['id']): Promise<TEntity|null>
    findAll(page?: number, limit?: number): Promise<Pagination<TEntity>>
    create(body: TInsert): Promise<TEntity>
    delete(entityId: TEntity['id']): Promise<TEntity|null>
    update(entityId: TEntity['id'], partialBody: Partial<TEntity>): Promise<TEntity|null>
}
