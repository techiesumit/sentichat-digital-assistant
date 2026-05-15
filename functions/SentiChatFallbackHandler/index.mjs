// SentiChatFallbackHandler — FallbackIntent fulfillment

import { buildResponse } from "/opt/nodejs/lexResponseBuilder.mjs";
import { saveSession } from "/opt/nodejs/dynamoHelper.mjs";
import {
  getSentiment, getNegativeScore, getTopNluConfidence,
  getSessionId, getSlots, getSessionAttrs,
} from "/opt/nodejs/sentimentRouter.mjs";
import { MESSAGES } from "/opt/nodejs/constants.mjs";

export const handler = async (event) => {
  console.log("FallbackHandler event:", JSON.stringify(event, null, 2));

  const sessionId     = getSessionId(event);
  const sessionAttrs  = getSessionAttrs(event);
  const slots         = getSlots(event);
  const sentiment     = getSentiment(event);
  const negativeScore = getNegativeScore(event);
  const topConfidence = getTopNluConfidence(event);

  console.log(`FallbackIntent — sentiment: ${sentiment}`);

  const updatedAttrs = {
    ...sessionAttrs,
    escalate_to_agent : "true",
    escalation_reason : "fallback_unresolved",
    sentiment         : sentiment,
    negative_score    : negativeScore.toFixed(3),
  };

  await saveSession({
    sessionId,
    intentName       : "FallbackIntent",
    sentiment,
    negativeScore,
    topConfidence,
    escalated        : true,
    escalationReason : "fallback_unresolved",
    slots,
    sessionAttrs     : updatedAttrs,
  });

  return buildResponse(MESSAGES.FALLBACK, updatedAttrs, "FallbackIntent", "Fulfilled");
};