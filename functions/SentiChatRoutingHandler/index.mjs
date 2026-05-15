// ── SentiChatRoutingHandler ─────────────────────────────────────
// Alias-level Lambda — fires on EVERY Lex turn.
// Responsibility: Sentiment check + escalation routing ONLY.
// Does NOT handle intent fulfillment — that's per-intent handlers.

import {
  getIntentName, getSentiment, getNegativeScore,
  getTopNluConfidence, getSessionId, getSlots,
  getSessionAttrs, checkEscalation,
} from "/opt/nodejs/sentimentRouter.mjs";
import { buildResponse, buildEscalationAttrs } from "/opt/nodejs/lexResponseBuilder.mjs";
import { saveSession } from "/opt/nodejs/dynamoHelper.mjs";
import { MESSAGES } from "/opt/nodejs/constants.mjs";

export const handler = async (event) => {
  console.log("RoutingHandler event:", JSON.stringify(event, null, 2));

  const intentName    = getIntentName(event);
  const sentiment     = getSentiment(event);
  const negativeScore = getNegativeScore(event);
  const topConfidence = getTopNluConfidence(event);
  const sessionId     = getSessionId(event);
  const sessionAttrs  = getSessionAttrs(event);
  const slots         = getSlots(event);

  const { shouldEscalate, escalationReason } = checkEscalation(
    intentName, sentiment, negativeScore, topConfidence
  );

  if (shouldEscalate) {
    console.log(`🚨 ESCALATING — reason: ${escalationReason}`);

    const updatedAttrs = buildEscalationAttrs(
      sessionAttrs, sentiment, negativeScore, escalationReason
    );

    await saveSession({
      sessionId, intentName, sentiment, negativeScore,
      topConfidence, escalated: true, escalationReason,
      slots, sessionAttrs: updatedAttrs,
    });

    return buildResponse(
      MESSAGES.ESCALATION, updatedAttrs, intentName, "Fulfilled"
    );
  }

  // ── No escalation — let Lex continue to intent fulfillment ────
  console.log(`✅ CONTINUING — intent: ${intentName}`);
  return buildResponse(null, sessionAttrs, intentName, "InProgress");
};