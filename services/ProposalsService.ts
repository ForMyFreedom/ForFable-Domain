import { BaseHTTPService } from "./BaseHTTPService"
import { ProposalEntity, PromptEntity, UserEntity, ProposalInsert } from "../entities"
import { ResponseHandler, WriteRepository, PromptRepository, ProposalRepository } from "../contracts"
import { ApiResponse, Pagination, ProposalsUsecase } from '../usecases'

export class ProposalsService extends BaseHTTPService implements ProposalsUsecase {
  constructor(
    private readonly proposalsRepository: ProposalRepository,
    private readonly promptRepository: PromptRepository,
    private readonly writeRepository: WriteRepository,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  public async indexByPrompt(promptId: PromptEntity['id']): Promise<Pagination<ProposalEntity>> {
    const prompt = await this.promptRepository.find(promptId)
    if (!prompt) {
      return this.responseHandler.UndefinedId<object>()
    }
    const proposals = await this.proposalsRepository.getProposalsByPrompt(promptId)
    return this.responseHandler.SucessfullyRecovered<Pagination<ProposalEntity>>(proposals)
  }

  public async actualIndexByPrompt(promptId: PromptEntity['id']): Promise<Pagination<ProposalEntity>> {
    const prompt = await this.promptRepository.find(promptId)
    if (!prompt) {
      return this.responseHandler.UndefinedId<object>()
    }
    const proposals = await this.proposalsRepository.getIndexedProposalsByPrompt(promptId, prompt.currentIndex)
    return this.responseHandler.SucessfullyRecovered(proposals)
  }

  public async show(proposalId: ProposalEntity['id']): Promise<ApiResponse<ProposalEntity>> {
    const proposal = await this.proposalsRepository.fullFind(proposalId)
    if (proposal) {
      return this.responseHandler.SucessfullyRecovered(proposal)
    } else {
      return this.responseHandler.UndefinedId<object>()
    }
  }

  public async store(userId: UserEntity['id']|undefined, body: ProposalInsert ): Promise<ApiResponse<ProposalEntity>> {
    if (!userId) {
      return this.responseHandler.InvalidUser<object>()
    }

    const { text, promptId } = body
    const prompt = await this.promptRepository.find(promptId)

    if (!prompt) {
      return this.responseHandler.UndefinedWrite<object>()
    }

    const promptWrite = await this.promptRepository.getWrite(prompt)

    if (prompt.concluded) {
      return this.responseHandler.CantProposeToClosedHistory<object>()
    }

    if (prompt.isDaily && promptWrite.authorId === null) {
      return this.responseHandler.CantProposeToUnappropriatedPrompt<object>()
    }

    if (prompt.maxSizePerExtension < text.length) {
      return this.responseHandler.TextLengthHigherThanAllowed<object>()
    }

    const finalText = insertSpaceInStartOfText(text)

    const proposalWrite = await this.writeRepository.create(
      { text: finalText, authorId: userId }
    )

    const proposal = await this.proposalsRepository.create({
      writeId: proposalWrite.id,
      promptId: promptId,
      orderInHistory: prompt.currentIndex,
    })

    return this.responseHandler.SucessfullyCreated(proposal)
  }

  public async update(userId: UserEntity['id']|undefined, proposalId: ProposalEntity['id'], partialBody: Partial<ProposalInsert>): Promise<ApiResponse<ProposalEntity>> {
    if (!userId) {
      return this.responseHandler.Unauthenticated<object>()
    }
  
    const proposal = await this.proposalsRepository.find(proposalId)
    if (!proposal) {
      return this.responseHandler.UndefinedId<object>()
    }
    const writeProposal = await this.proposalsRepository.getWrite(proposal)

    if (writeProposal.authorId !== userId) {
      return this.responseHandler.CantEditOthersWrite<object>()
    }

    const newProposal = await this.proposalsRepository.update(
      proposal.id, partialBody
    )
    
    return this.responseHandler.SucessfullyUpdated(newProposal)
  }

  public async destroy(userId: UserEntity['id']|undefined, proposalId: ProposalEntity['id']): Promise<ApiResponse<ProposalEntity>> {
    const proposal = await this.proposalsRepository.find(proposalId)

    if (!proposal) {
      return this.responseHandler.UndefinedId<object>()
    }

    const proposalWrite = await this.proposalsRepository.getWrite(proposal)

    if (proposalWrite.authorId === userId) {
      await this.proposalsRepository.delete(proposalId)
      return this.responseHandler.SucessfullyDestroyed(proposal)
    } else {
      return this.responseHandler.CantDeleteOthersWrite<object>()
    }
  }

  public async indexByAuthor(authorId: number, page?: number | undefined, limit?: number | undefined): Promise<Pagination<ProposalEntity>> {
    const response = await this.proposalsRepository.getProposalsByAuthor(authorId, page, limit)
    return this.responseHandler.SucessfullyRecovered(response)
  }
}


function insertSpaceInStartOfText(text: string): string {
  return text[0] === ' ' ? text : ' ' + text
}
