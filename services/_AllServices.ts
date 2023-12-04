import { UsersService, StoryAdvanceService, ReactWritesService, CommentsService, ConstantsService, DailyPromptsService, GenresService, ImageService, LoginService, MailService, PromptsService, ProposalsService, ReactCommentsService } from "."

export interface AllServices {
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