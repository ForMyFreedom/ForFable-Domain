import { BaseHTTPService } from './BaseHTTPService'
import { ResponseHandler, ProposalRepository, WriteRepository, PromptRepository, ReactWriteRepository } from '../contracts'
import { UserEntity, ReactionType, getExibitionReaction, WriteEntity, WriteReactionEntity, WriteReactionInsert, ReactionEntity } from '../entities'
import { ApiResponse, ReactWritesUsecase } from '../usecases'

export class ReactWritesService extends BaseHTTPService implements ReactWritesUsecase {
  constructor(
    private readonly reactWriteRepository: ReactWriteRepository,
    private readonly writeRepository: WriteRepository,
    private readonly proposalRepository: ProposalRepository,
    private readonly promptRepository: PromptRepository,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  public async show(writeId: WriteEntity['id']): Promise<ApiResponse<WriteReactionEntity>> {
    const write = await this.writeRepository.find(writeId)
    if (!write) {
      return this.responseHandler.UndefinedId<object>()
    }
    const bruteReactions =
      await this.reactWriteRepository.getBruteReactions(writeId)
    
    const reactions = getExibitionReaction(bruteReactions)
    return this.responseHandler.SucessfullyRecovered<object>(reactions)
  }

  public async store(userId: UserEntity['id']|undefined, body: WriteReactionInsert): Promise<ApiResponse<WriteReactionEntity>> {
    if (!userId) {
      return this.responseHandler.Unauthenticated<object>()
    }

    const write = await this.writeRepository.find(body.writeId)

    if (!write) {
      return this.responseHandler.UndefinedWrite<object>()
    }

    if (write.authorId == userId) {
      return this.responseHandler.CantReactYourself<object>()
    }

    if (body.type === ReactionType.COMPLAINT && await this.writeIsDaily(body.writeId)) {
      return this.responseHandler.CantComplaintToDailyWrite<object>()
    }

    if (ReactionEntity.reactionIsConclusive(body.type)) {
      if (await this.promptRepository.findByWriteId(body.writeId)) {
        return this.responseHandler.CantUseConclusiveReactionInPrompt<object>()
      } else {
        const writeIsProposal = await this.proposalRepository.findByWriteId(write.id)
        if (writeIsProposal) {
          if (await this.promptRepository.promptIsConcluded(writeIsProposal.promptId)) {
            return this.responseHandler.CantUseConclusiveReactionInConcludedHistory<object>()
          }
        }
      }
    }

    const couldFind = await this.reactWriteRepository.getCertainReaction(userId, write.id)
    
    if (couldFind) {
      await this.reactWriteRepository.delete(couldFind.id)
    }

    const reaction = await this.reactWriteRepository.create({
      ...body, userId: userId
    })

    return this.responseHandler.SucessfullyCreated(reaction)
  }

  public async destroy(userId: UserEntity['id']|undefined, reactionId: WriteReactionEntity['id']): Promise<ApiResponse<WriteReactionEntity>> {
    if (!userId) {
      return this.responseHandler.Unauthenticated<object>()
    }

    const reaction = await this.reactWriteRepository.find(reactionId)
    if (!reaction) {
      return this.responseHandler.UndefinedId<object>()
    }
  
    if (userId === reaction.userId) {
      await this.reactWriteRepository.delete(reactionId)
      return this.responseHandler.SucessfullyDestroyed(reaction)
    } else {
      return this.responseHandler.CantDeleteOthersReaction<object>()
    }
  }

  async writeIsDaily(writeId: number): Promise<boolean> {
    const prompts = await this.promptRepository.findByWriteId(writeId)
    return !!prompts && prompts.isDaily
  }
}

