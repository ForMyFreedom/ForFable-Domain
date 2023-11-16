import { BaseHTTPService } from "./BaseHTTPService"
import { CommentReactionEntity, CommentEntity, CommentReactionInsert, UserEntity, ReactionEntity, cleanReactionResponse, CleanReactionResponse, ReactionType } from '../entities'
import { CommentRepository, ResponseHandler, ReactCommentRepository } from '../contracts'
import { ApiResponse, ReactCommentsUsecase } from '../usecases'

export class ReactCommentsService extends BaseHTTPService implements ReactCommentsUsecase {
  constructor(
    private readonly reactCommentRepository: ReactCommentRepository,
    private readonly commentRepository: CommentRepository,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  public async show(userId: UserEntity['id']|undefined, commentId: CommentEntity['id']): Promise<ApiResponse<CleanReactionResponse>> {
    const comment = await this.commentRepository.find(commentId)
    
    if (!comment) {
      return this.responseHandler.UndefinedId()
    }

    const bruteReactions =
      await this.reactCommentRepository.getBruteReactions(commentId)

    const userReaction: ReactionType|undefined = (userId) ?
      bruteReactions.find(reaction => reaction.userId === userId)?.type :
      undefined

    const reactions = cleanReactionResponse(bruteReactions, userReaction)
    return this.responseHandler.SucessfullyRecovered(reactions)
  }

  public async store(userId: UserEntity['id']|undefined, body: CommentReactionInsert): Promise<ApiResponse<CommentReactionEntity>> {
    if (!userId) {
      return this.responseHandler.InvalidUser()
    }

    const comment = await this.commentRepository.find(body.commentId)
    if (!comment) {
      return this.responseHandler.NotFound()
    }

    if (comment.authorId == userId) {
      return this.responseHandler.CantReactYourself()
    }

    if (ReactionEntity.reactionIsConclusive(body.type)) {
      return this.responseHandler.CantUseConclusiveReactionInComment()
    }

    const couldFind = await this.reactCommentRepository.getCertainReaction(
      userId, body.commentId
    )

    if (couldFind) {
      await this.reactCommentRepository.delete(couldFind.id)
    }

    const reaction = await this.reactCommentRepository.create(
      { ...body, userId: userId }
    )

    return this.responseHandler.SucessfullyCreated(reaction)
  }

  public async destroy(userId: UserEntity['id']|undefined, reactCommentId: CommentReactionEntity['id']): Promise<ApiResponse<CommentReactionEntity>> {
    if (!userId) {
      return this.responseHandler.Unauthenticated()
    }

    const reaction = await this.reactCommentRepository.find(reactCommentId)
    if (reaction) {
      if (userId === reaction.userId) {
        await this.reactCommentRepository.delete(reactCommentId)
        return this.responseHandler.SucessfullyDestroyed(reaction)
      } else {
        return this.responseHandler.CantDeleteOthersReaction()
      }
    } else {
      return this.responseHandler.UndefinedId()
    }
  }
}
