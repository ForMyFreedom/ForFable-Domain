import { BaseHTTPService } from './BaseHTTPService'
import { ApiResponse, PaginationData } from "../usecases/BaseUsecase"
import { WriteRepository, ResponseHandler, CommentRepository } from '../contracts'
import { WriteEntity, UserEntity, CommentEntity, CommentInsert } from '../entities'
import { CommentsUsecase, EstruturatedCommentsWithAnswers, WithUsers } from '../usecases'

export class CommentsService extends BaseHTTPService implements CommentsUsecase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly writeRepository: WriteRepository,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  public async indexByWrite(writeId: WriteEntity['id'], page?: number, limit?: number): Promise<ApiResponse<WithUsers<PaginationData<EstruturatedCommentsWithAnswers>>>> {
    if (! await this.writeRepository.find(writeId)) {
      return this.responseHandler.UndefinedId()
    }
    const comments = await this.commentRepository.getByWrite(writeId, page, limit)
    if(!comments?.all){
      return this.responseHandler.InternalServerError()
    }

    const authors: UserEntity[] = await this.commentRepository.loadAuthors(comments.all)

    const estruturatedComments: PaginationData<EstruturatedCommentsWithAnswers> = {
      ...comments, all: estruturateCommentsWithAnswers(comments.all)
    }
    
    const response = { ...estruturatedComments, users: authors }
    return this.responseHandler.SucessfullyRecovered(response)
  }


  public async store(user: UserEntity|undefined, body: CommentInsert): Promise<ApiResponse<CommentEntity>> {
    if (!user) {
      return this.responseHandler.Unauthenticated()
    }

    if(! await this.writeRepository.find(body.writeId)) {
      return this.responseHandler.UndefinedWrite()
    }

    if (body.answerToId) {
      const toAnswer = await this.commentRepository.find(body.answerToId)
      if(!toAnswer){
        return this.responseHandler.UndefinedComment()
      }

      if(toAnswer.writeId !== body.writeId) {
        return this.responseHandler.IncompatibleWriteAndAnswer()
      }
    }

    const comment = await this.commentRepository.create({
      ...body, authorId: user.id
    })
    return this.responseHandler.SucessfullyCreated(comment)
  }


  public async update(userId: UserEntity['id']|undefined, commentId: CommentEntity['id'], body: Partial<CommentInsert>): Promise<ApiResponse<CommentEntity>> {
    if (!userId) {
      return this.responseHandler.Unauthenticated()
    }

    const comment = await this.commentRepository.find(commentId)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { writeId, answerToId, ...safeBody } = body

    if (!comment) {
      return this.responseHandler.UndefinedId()
    }

    if (comment.authorId !== userId) {
      return this.responseHandler.CantEditOthersWrite()
    }

    const updatedComment = await this.commentRepository.update(commentId, {... safeBody, edited: true})
    return this.responseHandler.SucessfullyUpdated(updatedComment)
  }


  public async destroy(userId: UserEntity['id']|undefined, commentId: CommentEntity['id']): Promise<ApiResponse<CommentEntity>> {
    if (!userId) {
      return this.responseHandler.Unauthenticated()
    }

    const comment = await this.commentRepository.find(commentId)

    if (!comment) {
      return this.responseHandler.UndefinedId()
    }

    if (comment.authorId !== userId) {
      return this.responseHandler.CantDeleteOthersWrite()
    }

    const deletedComment = await this.commentRepository.delete(commentId)
    return this.responseHandler.SucessfullyDestroyed(deletedComment)
  }
}



function estruturateCommentsWithAnswers(
  commentsArray: (CommentEntity & {answers?: CommentEntity[]})[]
): EstruturatedCommentsWithAnswers[] {
  commentsArray = commentsArray.sort((a, b) => a.id - b.id)
  const newCommentsArray: EstruturatedCommentsWithAnswers[] = []
  for (const comment of commentsArray) {
    const answerToId = comment.answerToId
    if (answerToId) {
      const commentOwner = commentsArray.find((c) => c.id == answerToId)
      if (commentOwner) {
        if(!commentOwner.answers){
          commentOwner.answers = []
        }
        commentOwner.answers.push(comment)
      }
    } else {
      newCommentsArray.push({comment: comment, answers: []})
    }
  }
  return newCommentsArray
}

