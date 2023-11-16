import { DateTime } from 'luxon'
import { UserEntity } from './User'
import { CommentEntity } from './Comment'
import { WriteEntity } from './Write'
import { ConstantEntity } from './Constant'
import { PromptEntity } from './Prompt'

export enum ReactionType {
  'POSITIVE'='POSITIVE',
  'NEGATIVE'='NEGATIVE',
  'CONCLUSIVE'='CONCLUSIVE',
  'COMPLAINT'='COMPLAINT',
  'POSITIVE_CONCLUSIVE'='POSITIVE_CONCLUSIVE',
}



export interface ReactionEntity { // "Abstract"
  id: number
  userId: UserEntity['id']
  type: ReactionType
  createdAt: DateTime
  updatedAt: DateTime
}

export interface CommentReactionEntity extends ReactionEntity {
  commentId: CommentEntity['id']
}

export interface WriteReactionEntity extends ReactionEntity {
  writeId: WriteEntity['id']
}

export type CommentReactionInsert = Pick<CommentReactionEntity, 'commentId'|'type'>

export type WriteReactionInsert = Pick<WriteReactionEntity, 'writeId'|'type'>


export namespace ReactionEntity {
  export async function removeScoreAlterationInTarget(reaction: ReactionEntity, author: UserEntity, constant: ConstantEntity): Promise<void> {
    author.score -= await getScoreImpactOfReaction(reaction.type, constant)
  }
  
  export async function verifyInteractionBan(reactions: ReactionEntity[], story: PromptEntity, { exclusionPercentage }: ConstantEntity): Promise<boolean> {
    const diff = getComplainVsPositive(reactions)
    const exclusionLimiar = 1 + story.popularity * exclusionPercentage
    return diff > exclusionLimiar
  }
  
  export async function addScoreAlterationInTarget(reaction: ReactionEntity, author: UserEntity, constant: ConstantEntity): Promise<void> {
    author.score += await getScoreImpactOfReaction(reaction.type, constant)
  }

  export function reactionIsConclusive(type: ReactionType): boolean {
    return type === ReactionType.CONCLUSIVE || type === ReactionType.POSITIVE_CONCLUSIVE
  }
  
  export function reactionPositive(type: ReactionType): boolean {
    return type === ReactionType.POSITIVE || type === ReactionType.POSITIVE_CONCLUSIVE
  }
  
  
  export function calculatePointsThrowReactions(reactionsArray: ReactionEntity[]): number {
    let points = 0
    for (const reaction of reactionsArray) {
      points += getNumericValueOfReaction(reaction.type)
    }
    return points
  }
  
  export function getComplainVsPositive(allReactions: ReactionEntity[]): number {
    return (
      allReactions.filter(r => r.type === ReactionType.COMPLAINT).length
    ) - (
      allReactions.filter(r => reactionPositive(r.type)).length
    )
  }
  
  export function getNumericValueOfReaction(type: ReactionType): number {
    const typeToNumber: {[key in ReactionType]: number} = {
      'POSITIVE': 1,
      'NEGATIVE': -1,
      'CONCLUSIVE': 1,
      'COMPLAINT': -2,
      'POSITIVE_CONCLUSIVE': 2,
    }
  
    return typeToNumber[ReactionType[type]]
  }
  
  export async function getScoreImpactOfReaction(type: ReactionType, { strengthOfPositiveOpinion, strengthOfNegativeOpinion }: ConstantEntity): Promise<number> {
    const strengthByType: {[key in ReactionType]: number} = {
      'POSITIVE': strengthOfPositiveOpinion,
      'NEGATIVE': 0,
      'CONCLUSIVE': 0,
      'COMPLAINT': -strengthOfNegativeOpinion,
      'POSITIVE_CONCLUSIVE': strengthOfPositiveOpinion
    }
  
    return strengthByType[type]
  }
}

export type ExibitionReaction = {type: ReactionType, amount: number}

export type CleanReactionResponse = {
  reactions: ExibitionReaction[]
  userReaction: ReactionType|null
}