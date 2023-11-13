import { BaseHTTPService } from './BaseHTTPService'
import { Pagination, ApiResponse, GenericResponse } from '../usecases/BaseUsecase'
import { ExceptionContract, ResponseHandler, TokenRepository, UserRepository } from '../contracts'
import { PromptEntityWithWrite, ProposalEntityWithWrite, RestartPasswordInsert, UserEntity, UserInsert, UserUpdate } from '../entities'
import { EmailSended, MailUsecase, UsersUsecase } from '../usecases'
import { prettifyErrorList } from '../utils'
import { DateTime } from 'luxon'

export class UsersService extends BaseHTTPService implements UsersUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly mailService: MailUsecase,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  public async index(page: number, limit: number): Promise<Pagination<UserEntity>> {
    const response = await this.userRepository.findAll(page, limit)
    return this.responseHandler.SucessfullyRecovered(response)
  }

  public async indexWritesByAuthor(authorId: number, page?: number | undefined, limit?: number | undefined): Promise<Pagination<(ProposalEntityWithWrite | PromptEntityWithWrite)>> {
    const response = await this.userRepository.indexWritesByAuthor(authorId, page, limit)
    if(response?.all) {
      response.all = response.all.sort((a, b) => {
        return DateTime.fromISO(b.write.createdAt.toString()).toUnixInteger() - DateTime.fromISO(a.write.createdAt.toString()).toUnixInteger()
      })
    }
    return this.responseHandler.SucessfullyRecovered(response)
  }

  public async show(userId: UserEntity['id']): Promise<ApiResponse<UserEntity>> {
    const user = await this.userRepository.find(userId)
    if (user) {
      return this.responseHandler.SucessfullyRecovered(user)
    } else {
      return this.responseHandler.UndefinedId()
    }
  }

  public async store(body: UserInsert, isAdmin: boolean): Promise<ApiResponse<UserEntity>> {
    const needToVerifyEmail = await this.userRepository.isNeedToVerifyEmail()

    const user = await this.userRepository.create({
      ...body, isAdmin: isAdmin, emailVerified: !needToVerifyEmail
    })

    if (needToVerifyEmail) {
      await this.mailService.sendUserVerificationMail(user)
    }


    await this.userRepository.update(user.id, {emailVerified: !needToVerifyEmail})

    return this.responseHandler.SucessfullyCreated(user)
  }

  public async update(responserId: UserEntity['id']|undefined, userId: UserEntity['id'], partialBody: Partial<UserUpdate>): Promise<ApiResponse<UserEntity>> {
    if (!responserId) {
      return this.responseHandler.Unauthenticated()
    }
    const user = await this.userRepository.find(userId)

    if (!user) {
      return this.responseHandler.UndefinedId()
    }

    if (responserId === user.id) {
      const finalBody = ! user.isPremium
        ? { name: partialBody.name || user.name }
        : partialBody
      const response = await this.userRepository.update(user.id, finalBody)
      return this.responseHandler.SucessfullyUpdated(response)
    } else {
      return this.responseHandler.CantEditOtherUser()
    }
  }

  public async destroy(responserId: UserEntity['id']|undefined, userId: UserEntity['id']): Promise<ApiResponse<UserEntity>> {
    if (!responserId) {
      return this.responseHandler.Unauthenticated()
    }

    const user = await this.userRepository.find(userId)

    if (!user) {
      return this.responseHandler.UndefinedId()
    }

    if (user.id === responserId) {
      await this.userRepository.softDelete(user.id)
      return this.responseHandler.SucessfullyDestroyed(user)
    } else {
      return this.responseHandler.CantDeleteOtherUser()
    }
  }

  public async verifyEmail(token: string|undefined): Promise<ApiResponse<boolean>> {
    if (!token) {
      return this.responseHandler.BadRequest()
    }

    const findToken = await this.tokenRepository.findByToken(token) 

    if (!findToken) {
      return this.responseHandler.Unauthenticated()
    }

    const user = await this.tokenRepository.getUser(findToken)
    if (!user) { return this.responseHandler.NotFound() }
    user.emailVerified = true
    await this.userRepository.update(user.id, user)
    await this.tokenRepository.delete(findToken.id)

    return this.responseHandler.SuccessfullyAuthenticated()
  }

  public async requestPasswordChange(user: UserEntity|undefined): Promise<ApiResponse<EmailSended>> {
    if (!user) {
      return this.responseHandler.Unauthenticated()
    }
    const response = await this.mailService.sendUserResetPasswordMail(user)
    return this.responseHandler.EmailSended(response.data)
  }

  public async restartPassword(langContract: ExceptionContract, token: string|undefined, body: RestartPasswordInsert): Promise<GenericResponse> {
    if (!token) {
      return { error: langContract.UndefinedToken }
    }

    const { errors } = await this.userRepository.passwordIsValid(body)
    if (errors) {
      return { error: prettifyErrorList(errors) }
    }

    const findToken = await this.tokenRepository.findByToken(token)

    if (!findToken) {
      return { error: langContract.TokenIsInvalid }
    }

    const user = await this.tokenRepository.getUser(findToken)
    if (!user) { return { error: langContract.NotFound } }
    user.password = body.password
    await this.userRepository.update(user.id, user)
    await this.tokenRepository.delete(findToken.id)

    return {}
  }
}
