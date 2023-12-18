
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

export type ProposalWithWrite = ProposalEntity & { write: WriteEntity }
export type ProposalWithPromptName = ProposalWithWrite & { promptName: string }
export type FullProposalEntity = ProposalWithPromptName & { prompt: PromptEntity }
export type ProposalWithUser = FullProposalEntity & { author: UserEntity }