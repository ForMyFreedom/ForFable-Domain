import { UsersService, StoryAdvanceService, ReactWritesService, CommentsService, ConstantsService, DailyPromptsService, GenresService, ImageService, LoginService, MailService, PromptsService, ProposalsService, ReactCommentsService } from "."
import { UsersController, StoryAdvanceController, ReactWritesController, CommentsController, ConstantsController, DailyPromptsController, GenresController, ImagesController, LoginController, MailController, PromptsController, ProposalsController, ReactCommentsController } from "../usecases"

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
    DailyPromptsService: DailyPromptsController
    GenresService: GenresController
    MailService: MailController
    PromptsService: PromptsController
    ProposalsService: ProposalsController
    ReactCommentsService: ReactCommentsController
    ReactWritesService: ReactWritesController
    UsersService: UsersController
    StoryAdvanceService: StoryAdvanceController
    LoginService: LoginController
    ImageService: ImagesController
}