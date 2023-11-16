import { CleanReactionResponse, ExibitionReaction, ReactionEntity, ReactionType } from "../Reaction"

export function cleanReactionResponse(reactions: ReactionEntity[], userReaction: ReactionType|undefined): CleanReactionResponse {
  const cleanReactions = getExibitionReaction(reactions)
  return { reactions: cleanReactions, userReaction: userReaction || null }
}

function getExibitionReaction(reactions: ReactionEntity[]): ExibitionReaction[] {
  let cleanReactions: ExibitionReaction[] = getBruteExitionReactionList(reactions)
  const positiveConclusive: number = getPositiveConclusiveReactionAmount(cleanReactions)

  cleanReactions = removeAllPositiveConclusive(cleanReactions)
  cleanReactions = solvePositiveAggregate(positiveConclusive, cleanReactions)
  cleanReactions = solveConclusiveAggregate(positiveConclusive, cleanReactions)
  cleanReactions = cleanBlankReactions(cleanReactions)

  return cleanReactions
}

function getBruteExitionReactionList(reactions: ReactionEntity[]): ExibitionReaction[] {
  const list: ExibitionReaction[] = []
  for(const react of reactions) {
    const reaction = list.find((value)=>value.type === react.type)
    if (reaction) {
      reaction.amount++
    } else {
      list.push({type: react.type, amount: 1})
    }
  }
  return list
}

function getPositiveConclusiveReactionAmount(reactions: ExibitionReaction[]): number {
  return reactions.find((value)=>value.type === ReactionType.POSITIVE_CONCLUSIVE)?.amount || 0
}

function removeAllPositiveConclusive(reactions: ExibitionReaction[]): ExibitionReaction[] {
  return reactions.filter((value)=> value.type !== ReactionType.POSITIVE_CONCLUSIVE)
}


function solvePositiveAggregate(positiveConclusive: number, reactions: ExibitionReaction[]): ExibitionReaction[] {
  const positive = findPositive(reactions)
  if (positive) {
    positive.amount += positiveConclusive
  } else {
    reactions.push({type: ReactionType.POSITIVE, amount: positiveConclusive})
  }

  return reactions
}


function solveConclusiveAggregate(positiveConclusive: number, reactions: ExibitionReaction[]): ExibitionReaction[] {
  const conclusive = findConclusive(reactions)
  if (conclusive) {
    conclusive.amount+=positiveConclusive
  } else {
    reactions.push({type: ReactionType.CONCLUSIVE, amount: positiveConclusive})
  }

  return reactions
}


function findPositive(cleanReactions: ExibitionReaction[]): ExibitionReaction | undefined {
  return cleanReactions.find((value)=>value.type === ReactionType.POSITIVE)
}


function findConclusive(cleanReactions: ExibitionReaction[]): ExibitionReaction | undefined {
  return cleanReactions.find((value)=>value.type === ReactionType.CONCLUSIVE)
}

function cleanBlankReactions(cleanReactions: ExibitionReaction[]): ExibitionReaction[] {
  return cleanReactions.filter((value)=> value.amount > 0)
}
