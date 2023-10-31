
export type StoreAdvanceResponse = { toContinueLoop: boolean }

export interface StoryAdvanceUsecase {
  tryMakeStoreAdvance(promptId: number): Promise<StoreAdvanceResponse>
}

export interface StoryAdvanceController extends StoryAdvanceUsecase { }
