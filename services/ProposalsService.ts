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
      return this.responseHandler.UndefinedId()
    }
    const proposals = await this.proposalsRepository.getProposalsByPrompt(promptId)
    return this.responseHandler.SucessfullyRecovered(proposals)
  }

  public async actualIndexByPrompt(promptId: PromptEntity['id']): Promise<Pagination<ProposalEntity>> {
    const prompt = await this.promptRepository.find(promptId)
    if (!prompt) {
      return this.responseHandler.UndefinedId()
    }
    const proposals = await this.proposalsRepository.getIndexedProposalsByPrompt(promptId, prompt.currentIndex)
    return this.responseHandler.SucessfullyRecovered(proposals)
  }

  public async show(proposalId: ProposalEntity['id']): Promise<ApiResponse<ProposalEntity>> {
    const proposal = await this.proposalsRepository.fullFind(proposalId)
    if (proposal) {
      return this.responseHandler.SucessfullyRecovered(proposal)
    } else {
      return this.responseHandler.UndefinedId()
    }
  }

  public async store(userId: UserEntity['id']|undefined, body: ProposalInsert ): Promise<ApiResponse<ProposalEntity>> {
    if (!userId) {
      return this.responseHandler.InvalidUser()
    }

    const { text, promptId } = body
    const prompt = await this.promptRepository.find(promptId)

    if (!prompt) {
      return this.responseHandler.UndefinedWrite()
    }

    const promptWrite = await this.promptRepository.getWrite(prompt)

    if (prompt.concluded) {
      return this.responseHandler.CantProposeToClosedHistory()
    }

    if (prompt.isDaily && promptWrite.authorId === null) {
      return this.responseHandler.CantProposeToUnappropriatedPrompt()
    }

    if (prompt.maxSizePerExtension < text.length) {
      return this.responseHandler.TextLengthHigherThanAllowed()
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
      return this.responseHandler.Unauthenticated()
    }
  
    const proposal = await this.proposalsRepository.find(proposalId)
    if (!proposal) {
      return this.responseHandler.UndefinedId()
    }
    const writeProposal = await this.proposalsRepository.getWrite(proposal)

    if (writeProposal.authorId !== userId) {
      return this.responseHandler.CantEditOthersWrite()
    }

    const newProposal = await this.proposalsRepository.update(
      proposal.id, partialBody
    )
    
    return this.responseHandler.SucessfullyUpdated(newProposal)
  }

  public async destroy(userId: UserEntity['id']|undefined, proposalId: ProposalEntity['id']): Promise<ApiResponse<ProposalEntity>> {
    const proposal = await this.proposalsRepository.find(proposalId)

    if (!proposal) {
      return this.responseHandler.UndefinedId()
    }

    const proposalWrite = await this.proposalsRepository.getWrite(proposal)

    if (proposalWrite.authorId === userId) {
      await this.proposalsRepository.delete(proposalId)
      return this.responseHandler.SucessfullyDestroyed(proposal)
    } else {
      return this.responseHandler.CantDeleteOthersWrite()
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
