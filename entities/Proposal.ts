
import { PromptEntity, WriteEntity } from "../entities"

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
}
