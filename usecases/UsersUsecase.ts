import { ApiResponse, EmailSended, GenericResponse, Pagination } from '.'
import { ExceptionContract } from '../contracts'
import { PromptEntity, ProposalEntity, RestartPasswordInsert, UserEntity, UserInsert, UserUpdate } from '../entities'

export interface UsersUsecase {
  index(page?: number, limit?: number): Promise<Pagination<UserEntity>>
  show(userId: UserEntity['id']): Promise<ApiResponse<UserEntity>>
  store(body: UserInsert, isAdmin: boolean): Promise<ApiResponse<UserEntity>>
  update(responserId: UserEntity['id']|undefined, userId: UserEntity['id'], partialBody: Partial<UserUpdate>): Promise<ApiResponse<UserEntity>>
  destroy(responserId: UserEntity['id']|undefined, userId: UserEntity['id']): Promise<ApiResponse<UserEntity>>
  verifyEmail(token: string|undefined): Promise<ApiResponse<boolean>>
  requestPasswordChange(user: UserEntity|undefined): Promise<ApiResponse<EmailSended>>
  restartPassword(langContract: ExceptionContract, token: string|undefined, body: RestartPasswordInsert): Promise<GenericResponse>
  indexWritesByAuthor(authorId: UserEntity['id'], page?: number, limit?: number): Promise<Pagination<PromptEntity|ProposalEntity>>
}

export interface UsersController extends Omit<UsersUsecase, 'store'|'update'|'destroy'|'restartPassword'> {
  storeAdmin(body: UserInsert): Promise<ApiResponse<UserEntity>>
  storeUser(body: UserInsert): Promise<ApiResponse<UserEntity>>
  update(userId: UserEntity['id'], partialBody: Partial<UserUpdate>): Promise<ApiResponse<UserEntity>>
  destroy(userId: UserEntity['id']): Promise<ApiResponse<UserEntity>>
  restartPassword(token: string|undefined, body: RestartPasswordInsert): Promise<GenericResponse>
}
