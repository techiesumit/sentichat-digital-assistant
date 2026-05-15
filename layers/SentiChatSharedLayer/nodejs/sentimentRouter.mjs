// ── sentimentRouter.mjs ─────────────────────────────────────────
// Extracts sentiment + intent data from Lex events
// and applies escalation routing logic.

import {
  NEGATIVE_SCORE_THRESHOLD,
  LOW_CONFIDENCE_THRESHOLD,
  ESCALATE_ALWAYS_INTENTS,
} from "./constants.mjs";

// ── Extractors ──────────────────────────────────────────────────
export const getIntentName = (event) =>
  event?.sessionState?.intent?.name ?? "FallbackIntent";

export const getSentiment = (event) =>
  event?.interpretations?.[0]?.sentimentResponse?.sentiment ?? "NEUTRAL";

export const getNegativeScore = (event) =>
  event?.interpretations?.[0]?.sentimentResponse?.sentimentScore?.negative ?? 0.0;

export const getTopNluConfidence = (event) => {
  for (const i of (event?.interpretations ?? []))
    if (i?.nluConfidence?.score !== undefined) return i.nluConfidence.score;
  return null;
};

export const getSessionId = (event) =>
  event?.sessionId ?? "unknown";

export const getSlots = (event) =>
  event?.sessionState?.intent?.slots ?? {};

export const getSessionAttrs = (event) =>
  event?.sessionState?.sessionAttributes ?? {};

// ── Escalation logic ────────────────────────────────────────────
export function checkEscalation(intentName, sentiment, negativeScore, topConfidence) {

  if (ESCALATE_ALWAYS_INTENTS.includes(intentName))
    return { shouldEscalate: true, escalationReason: "high_risk_intent" };

  if (intentName === "FallbackIntent" && sentiment === "NEGATIVE")
    return { shouldEscalate: true, escalationReason: "fallback_with_negative_sentiment" };

  if (sentiment === "NEGATIVE" && negativeScore >= NEGATIVE_SCORE_THRESHOLD)
    return { shouldEscalate: true, escalationReason: "high_negative_sentiment" };

  if (topConfidence !== null && topConfidence < LOW_CONFIDENCE_THRESHOLD)
    return { shouldEscalate: true, escalationReason: "low_nlu_confidence" };

  return { shouldEscalate: false, escalationReason: null };
}