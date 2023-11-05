import { BaseHTTPService } from './BaseHTTPService'
import { ApiResponse, Pagination } from '../usecases'
import { PromptEntity, PromptInsert, UserEntity, GenreEntity, GainControlOverDailyPromptInsert } from '../entities'
import { ResponseHandler, PromptRepository, WriteRepository, EventEmitter } from '../contracts'
import { PromptsUsecase } from '../usecases'
import { DailyPromptsService } from './DailyPromptsService'

export class PromptsService extends BaseHTTPService implements PromptsUsecase {
  constructor(
    private readonly promptsRepository: PromptRepository,
    private readonly writeRepository: WriteRepository,
    private readonly eventEmitter: EventEmitter,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  public async index(): Promise<Pagination<PromptEntity>> {
    const response = await this.promptsRepository.findAll()
    return this.responseHandler.SucessfullyRecovered(response)
  }

  public async show(promptId: PromptEntity['id']): Promise<ApiResponse<PromptEntity>> {
    const prompt = await this.promptsRepository.find(promptId)
    if (!prompt) {
      return this.responseHandler.UndefinedId()
    } else {
      return this.responseHandler.SucessfullyRecovered(prompt)
    }
  }

  public async store(authorId: UserEntity['id'], body: PromptInsert): Promise<ApiResponse<PromptEntity>> {
    const { text, genreIds, ...rest } = body
    if(!authorId) {
      return this.responseHandler.UndefinedId()
    }
    const write = await this.writeRepository.create({ text: text, authorId: authorId })
    const prompt = await this.promptsRepository.create({ ...rest, writeId: write.id })

    if (! await this.couldSetGenres(prompt, genreIds)) {
      await this.promptsRepository.delete(prompt.id)
      return this.responseHandler.InvalidGenre()
    }

    await this.eventEmitter.emitRunPromptEvent(prompt)
    return this.responseHandler.SucessfullyCreated(prompt)
  }

  public async update(userId: UserEntity['id']|undefined, promptId: PromptEntity['id'], partialPrompt: Partial<PromptInsert>): Promise<ApiResponse<PromptEntity>> {
    const { text, limitOfExtensions, genreIds, ...rest } = partialPrompt
    const prompt = await this.promptsRepository.find(promptId)
    if (!prompt) {
      return this.responseHandler.UndefinedId()
    }
    const write = await this.promptsRepository.getWrite(prompt)


    if (write.authorId !== userId) {
      return this.responseHandler.CantEditOthersWrite()
    }

    if (prompt.isDaily) {
      return this.responseHandler.CantEditDailyPrompt()
    }

    if (prompt.currentIndex === 0) {
      // Regulate "Virgin" Prompt Update Permissions
      if (text) {
        await this.writeRepository.update(write.id, { text: text, edited: true })
      }
      if (limitOfExtensions) {
        prompt.limitOfExtensions = limitOfExtensions
      }

      if (genreIds && genreIds.length > 0) {
        await this.promptsRepository.removeAllGenresFromPrompt(prompt)
        if (!(await this.couldSetGenres(prompt, genreIds))) {
          return this.responseHandler.InvalidGenre()
        }
      }
    }

    this.promptsRepository.update(promptId, rest)
    return this.responseHandler.SucessfullyUpdated(prompt)
  }

  public async destroy(userId: UserEntity['id']|undefined, promptId: PromptEntity['id']): Promise<ApiResponse<PromptEntity>> {
    const prompt = await this.promptsRepository.find(promptId)
    if (!prompt) {
      return this.responseHandler.UndefinedId()
    }

    if((await this.promptsRepository.getWrite(prompt)).authorId == userId) {
      const response = await this.promptsRepository.delete(promptId)
      return this.responseHandler.SucessfullyDestroyed(response)
    } else {
      return this.responseHandler.CantDeleteOthersWrite()
    }
  }

  public async appropriateDailyPrompt(userId: UserEntity['id']|undefined, promptId: PromptEntity['id'], body: GainControlOverDailyPromptInsert): Promise<ApiResponse<PromptEntity>> {
    if (!userId) {
      return this.responseHandler.Unauthenticated()
    }

    const prompt = await this.promptsRepository.find(promptId)

    if (!prompt) {
      return this.responseHandler.UndefinedId()
    }

    const write = await this.promptsRepository.getWrite(prompt)

    if (!prompt.isDaily || write.authorId !== null) {
      return this.responseHandler.NotAppropriablePrompt()
    }

    if (!this.textRespectPrompt(body.text, write.text)) {
      return this.responseHandler.TextDontRespectPrompt()
    }

    write.authorId = userId
    write.text = body.text
    prompt.title = body.title

    await this.promptsRepository.update(prompt.id, prompt)
    await this.writeRepository.update(write.id, write)
    return this.responseHandler.SucessfullyUpdated(prompt)
  }

  public async indexByAuthor(authorId: number, page?: number, limit?: number): Promise<Pagination<PromptEntity>> {
    const response = await this.promptsRepository.findAllByAuthor(authorId, page, limit)
    return this.responseHandler.SucessfullyRecovered(response)
  }

  private async couldSetGenres(prompt: PromptEntity, genreIds: GenreEntity['id'][]): Promise<boolean> {
    const couldSet = await this.promptsRepository.setGenresInPrompt(prompt, genreIds)
    return couldSet
  }

  private textRespectPrompt(text: string, prompt: string): boolean {
    const wordsInPrompt = prompt.split(DailyPromptsService.SEPARATOR)
    return wordsInPrompt.every((word) => text.toLowerCase().includes(word.toLocaleLowerCase()))
  }
}
