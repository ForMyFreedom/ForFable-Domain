import { ApiResponse, BaseHTTPService, Pagination } from './BaseHTTPService'
import { PromptEntity, PromptInsert, UserEntity, GenreEntity, GainControlOverDailyPromptInsert } from '../entities'
import { ExceptionHandler, PromptRepository, WriteRepository, EventEmitter } from '../contracts'
import { PromptsUsecase } from '../usecases'
import { DailyPromptsService } from './DailyPromptsService'

export class PromptsService extends BaseHTTPService implements PromptsUsecase {
  constructor(
    private readonly promptsRepository: PromptRepository,
    private readonly writeRepository: WriteRepository,
    private readonly eventEmitter: EventEmitter,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  public async index(): Promise<Pagination<PromptEntity>> {
    const response = await this.promptsRepository.findAll()
    this.exceptionHandler.SucessfullyRecovered(response)
    return { data: response }
  }

  public async show(promptId: PromptEntity['id']): Promise<ApiResponse<PromptEntity>> {
    const prompt = await this.promptsRepository.find(promptId)
    if (!prompt) {
      this.exceptionHandler.UndefinedId()
      return { error: 'UndefinedId' }
    } else {
      this.exceptionHandler.SucessfullyRecovered(prompt)
      return { data: prompt }
    }
  }

  public async store(authorId: UserEntity['id'], body: PromptInsert): Promise<ApiResponse<PromptEntity>> {
    const { text, genreIds, ...rest } = body
    if(!authorId) {
      this.exceptionHandler.UndefinedId()
      return { error: 'UndefinedId' }
    }
    const write = await this.writeRepository.create({ text: text, authorId: authorId })
    const prompt = await this.promptsRepository.create({ ...rest, writeId: write.id })

    if (! await this.couldSetGenres(prompt, genreIds)) {
      await this.promptsRepository.delete(prompt.id)
      this.exceptionHandler.InvalidGenre()
      return { error: 'InvalidGenre' }
    }

    await this.eventEmitter.emitRunPromptEvent(prompt)
    this.exceptionHandler.SucessfullyCreated(prompt)
    return { data: prompt }
  }

  public async update(userId: UserEntity['id']|undefined, promptId: PromptEntity['id'], partialPrompt: Partial<PromptInsert>): Promise<ApiResponse<PromptEntity>> {
    const { text, limitOfExtensions, genreIds, ...rest } = partialPrompt
    const prompt = await this.promptsRepository.find(promptId)
    if (!prompt) {
      this.exceptionHandler.UndefinedId()
      return { error: 'UndefinedId' }
    }
    const write = await this.promptsRepository.getWrite(prompt)


    if (write.authorId !== userId) {
      this.exceptionHandler.CantEditOthersWrite()
      return { error: 'CantEditOthersWrite' }
    }

    if (prompt.isDaily) {
      this.exceptionHandler.CantEditDailyPrompt()
      return { error: 'CantEditDailyPrompt' }
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
          this.exceptionHandler.InvalidGenre()
          return { error: 'InvalidGenre' }
        }
      }
    }

    this.promptsRepository.update(promptId, rest)
    this.exceptionHandler.SucessfullyUpdated(prompt)
    return { data: prompt }
  }

  public async destroy(userId: UserEntity['id']|undefined, promptId: PromptEntity['id']): Promise<ApiResponse<PromptEntity>> {
    const prompt = await this.promptsRepository.find(promptId)
    if (!prompt) {
      this.exceptionHandler.UndefinedId()
      return { error: 'UndefinedId' }
    }

    if((await this.promptsRepository.getWrite(prompt)).authorId == userId) {
      const response = await this.promptsRepository.delete(promptId)
      this.exceptionHandler.SucessfullyDestroyed(response)
      return response ? { data: response } : { error: 'UndefinedId' }
    } else {
      this.exceptionHandler.CantDeleteOthersWrite()
      return { error: 'CantDeleteOthersWrite' }
    }
  }

  public async appropriateDailyPrompt(userId: UserEntity['id']|undefined, promptId: PromptEntity['id'], body: GainControlOverDailyPromptInsert): Promise<ApiResponse<PromptEntity>> {
    if (!userId) {
      this.exceptionHandler.Unauthenticated()
      return { error: 'Unauthenticated' }
    }

    const prompt = await this.promptsRepository.find(promptId)

    if (!prompt) {
      this.exceptionHandler.UndefinedId()
      return { error: 'UndefinedId' }
    }

    const write = await this.promptsRepository.getWrite(prompt)

    if (!prompt.isDaily || write.authorId !== null) {
      this.exceptionHandler.NotAppropriablePrompt()
      return { error: 'NotAppropriablePrompt' }
    }

    if (!this.textRespectPrompt(body.text, write.text)) {
      this.exceptionHandler.TextDontRespectPrompt()
      return { error: 'TextDontRespectPrompt' }
    }

    write.authorId = userId
    write.text = body.text
    prompt.title = body.title

    await this.promptsRepository.update(prompt.id, prompt)
    await this.writeRepository.update(write.id, write)
    this.exceptionHandler.SucessfullyUpdated(prompt)
    return { data: prompt }
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
