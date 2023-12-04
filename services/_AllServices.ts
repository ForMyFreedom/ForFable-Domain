import { UsersService, StoryAdvanceService, ReactWritesService, CommentsService, ConstantsService, DailyPromptsService, GenresService, ImageService, LoginService, MailService, PromptsService, ProposalsService, ReactCommentsService } from "."
import { UsersController, ReactWritesController, CommentsController, ConstantsController, GenresController, ImagesController, LoginController, PromptsController, ProposalsController, ReactCommentsController } from "../usecases"

export type AllServices = {
    CommentsService: CommentsService
    ConstantsService: ConstantsService
    DailyPromptsService: DailyPromptsService
    GenresService: GenresService
    MailService: MailService
    PromptsService: PromptsService
    ProposalsService: ProposalsService
    ReactCommentsService: ReactCommentsService
    ReactWritesService: ReactWritesService
    UsersService: UsersService
    StoryAdvanceService: StoryAdvanceService
    LoginService: LoginService
    ImageService: ImageService
}

export type AllControllers = {
    CommentsService: CommentsController
    ConstantsService: ConstantsController
    GenresService: GenresController
    PromptsService: PromptsController
    ProposalsService: ProposalsController
    ReactCommentsService: ReactCommentsController
    ReactWritesService: ReactWritesController
    UsersService: UsersController
    LoginService: LoginController
    ImageService: ImagesController
}