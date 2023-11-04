import { BaseHTTPService } from "./BaseHTTPService"
import { CommentReactionEntity, CommentEntity, CommentReactionInsert, UserEntity, getExibitionReaction, ReactionEntity, ExibitionReaction } from '../entities'
import { CommentRepository, ResponseHandler, ReactCommentRepository } from '../contracts'
import { ApiResponse, ReactCommentsUsecase } from '../usecases'

export class ReactCommentsService extends BaseHTTPService implements ReactCommentsUsecase {
  constructor(
    private readonly reactCommentRepository: ReactCommentRepository,
    private readonly commentRepository: CommentRepository,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  public async show(commentId: CommentEntity['id']): Promise<ApiResponse<ExibitionReaction[]>> {
    const comment = await this.commentRepository.find(commentId)
    
    if (!comment) {
      return this.responseHandler.UndefinedId<object>()
    }

    const bruteReactions =
      await this.reactCommentRepository.getBruteReactions(commentId)

    const reactions = getExibitionReaction(bruteReactions)
    return this.responseHandler.SucessfullyRecovered(reactions)
  }

  public async store(userId: UserEntity['id']|undefined, body: CommentReactionInsert): Promise<ApiResponse<CommentReactionEntity>> {
    if (!userId) {
      return this.responseHandler.InvalidUser<object>()
    }

    const comment = await this.commentRepository.find(body.commentId)
    if (!comment) {
      return this.responseHandler.NotFound<object>()
    }

    if (comment.authorId == userId) {
      return this.responseHandler.CantReactYourself<object>()
    }

    if (ReactionEntity.reactionIsConclusive(body.type)) {
      return this.responseHandler.CantUseConclusiveReactionInComment<object>()
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
      return this.responseHandler.Unauthenticated<object>()
    }

    const reaction = await this.reactCommentRepository.find(reactCommentId)
    if (reaction) {
      if (userId === reaction.userId) {
        await this.reactCommentRepository.delete(reactCommentId)
        return this.responseHandler.SucessfullyDestroyed(reaction)
      } else {
        return this.responseHandler.CantDeleteOthersReaction<object>()
      }
    } else {
      return this.responseHandler.UndefinedId<object>()
    }
  }
}
