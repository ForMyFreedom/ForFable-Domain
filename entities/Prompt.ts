import { WriteEntity } from "./Write"
import { removeDuplicate } from "../utils"

export type PromptInsert = {
  genreIds: number[]
} & Pick<PromptEntity,
  'title'|'maxSizePerExtension'|
  'limitOfExtensions'|'timeForAvanceInMinutes'
> & Pick<WriteEntity, 'text'>

export type GainControlOverDailyPromptInsert =
  Pick<WriteEntity, 'text'> &
  Pick<PromptEntity, 'title'>

export interface PromptEntity {
  id: number
  title: string
  isDaily: boolean
  currentIndex: number
  concluded: boolean
  writeId: WriteEntity['id']
  maxSizePerExtension: number
  limitOfExtensions: number
  timeForAvanceInMinutes: number
  popularity: number             // The amount of Users that had interacted with
  historyText: string            // Not the prompt, but prompt + all proposals in order
}

export type  PromptEntityWithWrite = PromptEntity & { write: WriteEntity }

export namespace PromptEntity {
  export async function calculatePromptPopularity(prompt: PromptEntity, usersThatParticipated: {id: number}[]): Promise<void> {
    prompt.popularity = removeDuplicate(usersThatParticipated).length
  }

  export function setHistoryText(prompt: PromptEntity, writeFromPrompt: WriteEntity, proposalsWrites: WriteEntity[]): void {
    prompt.historyText = writeFromPrompt.text
    for(const proposal of proposalsWrites) {
      prompt.historyText += proposal.text
    }
  }
}

