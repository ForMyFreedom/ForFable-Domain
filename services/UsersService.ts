import { ApiResponse, BaseHTTPService, GenericResponse } from './BaseHTTPService'
import { ExceptionContract, ExceptionHandler, TokenRepository, UserRepository } from '../contracts'
import { RestartPasswordInsert, UserEntity, UserInsert, UserUpdate } from '../entities'
import { MailUsecase, UsersUsecase } from '../usecases'
import { prettifyErrorList } from '../utils'
import { Pagination } from '@ioc:forfabledomain'

export class UsersService extends BaseHTTPService implements UsersUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly mailService: MailUsecase,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  public async index(page: number, limit: number): Promise<Pagination<UserEntity>> {
    const response = await this.userRepository.findAll(page, limit)
    this.exceptionHandler.SucessfullyRecovered(response)
    return response
  }

  public async show(userId: UserEntity['id']): Promise<ApiResponse<UserEntity>> {
    const user = await this.userRepository.find(userId)
    if (user) {
      this.exceptionHandler.SucessfullyRecovered(user)
      return { data: user }
    } else {
      this.exceptionHandler.UndefinedId()
      return { error: 'UndefinedId' }
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

    this.exceptionHandler.SucessfullyCreated(user)
    return { data: user }
  }

  public async update(responserId: UserEntity['id']|undefined, userId: UserEntity['id'], partialBody: Partial<UserUpdate>): Promise<ApiResponse<UserEntity>> {
    if (!responserId) {
      this.exceptionHandler.Unauthenticated()
      return { error: 'Unauthenticated' }
    }
    const user = await this.userRepository.find(userId)

    if (!user) {
      this.exceptionHandler.UndefinedId()
      return { error: 'UndefinedId' }
    }

    if (responserId === user.id) {
      const finalBody = ! user.isPremium
        ? { name: partialBody.name || user.name, imageUrl: partialBody.imageUrl || user.imageUrl }
        : partialBody
      const response = await this.userRepository.update(user.id, finalBody)
      this.exceptionHandler.SucessfullyUpdated(response)
      return response ? { data: response } : {error: 'InternalServerError'}
    } else {
      this.exceptionHandler.CantEditOtherUser()
      return { error: 'CantEditOtherUser' }
    }
  }

  public async destroy(responserId: UserEntity['id']|undefined, userId: UserEntity['id']): Promise<ApiResponse<UserEntity>> {
    if (!responserId) {
      this.exceptionHandler.Unauthenticated()
      return { error: 'Unauthenticated' }
    }

    const user = await this.userRepository.find(userId)

    if (!user) {
      this.exceptionHandler.UndefinedId()
      return { error: 'UndefinedId' }
    }

    if (user.id === responserId) {
      await user.softDelete()
      this.exceptionHandler.SucessfullyDestroyed(user)
      return {data: user}
    } else {
      this.exceptionHandler.CantDeleteOtherUser()
      return { error: 'CantDeleteOtherUser' }
    }
  }

  public async verifyEmail(token: string|undefined): Promise<ApiResponse<boolean>> {
    if (!token) {
      this.exceptionHandler.BadRequest()
      return { data: false, error: 'BadRequest' }
    }

    const findToken = await this.tokenRepository.findByToken(token) 

    if (!findToken) {
      this.exceptionHandler.Unauthenticated()
      return { data: false, error: 'Unauthenticated' }
    }

    const user = await findToken.getUser()
    user.emailVerified = true
    await this.userRepository.update(user.id, user)
    await this.tokenRepository.delete(findToken.id)

    this.exceptionHandler.SuccessfullyAuthenticated()
    return { data: true }
  }

  public async requestPasswordChange(user: UserEntity|undefined): Promise<ApiResponse<boolean>> {
    if (!user) {
      this.exceptionHandler.Unauthenticated()
      return { data: false, error: 'Unauthenticated' }
    }
    await this.mailService.sendUserResetPasswordMail(user)
    this.exceptionHandler.EmailSended()
    return { data: true }
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

    const user = await findToken.getUser()
    user.password = body.password
    await this.userRepository.update(user.id, user)
    await this.tokenRepository.delete(findToken.id)

    return {}
  }
}
