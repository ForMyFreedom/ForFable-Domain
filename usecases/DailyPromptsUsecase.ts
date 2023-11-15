import { GenericResponse } from "."


export interface DailyPromptsUsecase {
  refreshDailyPrompt(): Promise<GenericResponse>
  deleteAllNonAppropriatedDailyPrompts(): Promise<GenericResponse>
  createDailyPromptsForEachGenre(): Promise<GenericResponse>
}

export interface DailyPromptsController extends DailyPromptsUsecase { }
