import { ApiResponse, GenericResponse, Pagination } from '.'
import { PromptEntityWithWrite, ProposalEntityWithWrite, RestartPasswordInsert, UserEntity, UserInsert, UserUpdate } from '../entities'

export interface UsersUsecase {
  index(page?: number, limit?: number): Promise<Pagination<UserEntity>>
  show(userId: UserEntity['id']): Promise<ApiResponse<UserEntity>>
  store(body: UserInsert, isAdmin: boolean): Promise<ApiResponse<UserEntity>>
  update(responserId: UserEntity['id']|undefined, userId: UserEntity['id'], partialBody: Partial<UserUpdate>): Promise<ApiResponse<UserEntity>>
  destroy(responserId: UserEntity['id']|undefined, userId: UserEntity['id']): Promise<ApiResponse<UserEntity>>
  verifyEmail(token: string|undefined): Promise<ApiResponse<boolean>>
  requestPasswordChange(user: UserEntity|undefined): Promise<GenericResponse>
  restartPassword(token: string|undefined, body: RestartPasswordInsert): Promise<GenericResponse>
  indexWritesByAuthor(authorId: UserEntity['id'], page?: number, limit?: number): Promise<Pagination<(ProposalEntityWithWrite | PromptEntityWithWrite)>>
}

export interface UsersController extends Omit<UsersUsecase, 'store'|'update'|'destroy'> {
  storeAdmin(body: UserInsert): Promise<ApiResponse<UserEntity>>
  storeUser(body: UserInsert): Promise<ApiResponse<UserEntity>>
  update(userId: UserEntity['id'], partialBody: Partial<UserUpdate>): Promise<ApiResponse<UserEntity>>
  destroy(userId: UserEntity['id']): Promise<ApiResponse<UserEntity>>
}