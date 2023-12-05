
import { PromptEntity, UserEntity, WriteEntity } from "../entities"

export type ProposalInsert = {
  text: string
} & Pick<ProposalEntity, 'promptId'>


export interface ProposalEntity {
  id: number
  writeId: WriteEntity['id']
  promptId: PromptEntity['id']
  orderInHistory: number
  definitive: boolean
  popularity: number // Good Reactions - Bad Reactions
  currentHistoryText: string
}

export type ProposalEntityWithWrite = ProposalEntity & { write: WriteEntity, promptName: string }
export type FullProposalEntity = ProposalEntityWithWrite & { prompt: PromptEntity }
export type ProposalWithUser = FullProposalEntity & { author: UserEntity }