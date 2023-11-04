import { ApiResponse } from "."


export type InternalProcessResponse = { success: boolean }

export interface DailyPromptsUsecase {
  refreshDailyPrompt(): Promise<ApiResponse<InternalProcessResponse>>
  deleteAllNonAppropriatedDailyPrompts(): Promise<ApiResponse<InternalProcessResponse>>
  createDailyPromptsForEachGenre(): Promise<ApiResponse<InternalProcessResponse>>
}

export interface DailyPromptsController extends DailyPromptsUsecase { }
