// ── SentiChatClaimsHandler ──────────────────────────────────────
// Intent-level fulfillment for CheckClaimStatus.
// TODO Phase 2: Replace placeholder with real Claims API call.

import { buildResponse } from "/opt/nodejs/lexResponseBuilder.mjs";
import { saveSession } from "/opt/nodejs/dynamoHelper.mjs";
import {
  getSentiment, getNegativeScore, getTopNluConfidence,
  getSessionId, getSlots, getSessionAttrs,
} from "/opt/nodejs/sentimentRouter.mjs";
import { MESSAGES } from "/opt/nodejs/constants.mjs";

export const handler = async (event) => {
  console.log("ClaimsHandler event:", JSON.stringify(event, null, 2));

  const sessionId     = getSessionId(event);
  const sessionAttrs  = getSessionAttrs(event);
  const slots         = getSlots(event);
  const sentiment     = getSentiment(event);
  const negativeScore = getNegativeScore(event);
  const topConfidence = getTopNluConfidence(event);

  // ── Extract slot value ────────────────────────────────────────
  const claimNumber =
    slots?.ClaimNumber?.value?.interpretedValue ?? "unknown";

  console.log(`✅ CheckClaimStatus — claimNumber: ${claimNumber}`);

  // ── TODO Phase 2: Call Claims API ─────────────────────────────
  // const claimData = await fetchClaimFromAPI(claimNumber);

  const responseMessage =
    `I found your claim information for claim number ${claimNumber}. ` +
    `An agent will provide full details shortly.`;

  const updatedAttrs = {
    ...sessionAttrs,
    last_intent  : "CheckClaimStatus",
    claim_number : claimNumber,
    sentiment    : sentiment,
  };

  await saveSession({
    sessionId,
    intentName       : "CheckClaimStatus",
    sentiment,
    negativeScore,
    topConfidence,
    escalated        : false,
    escalationReason : "none",
    slots,
    sessionAttrs     : updatedAttrs,
  });

  return buildResponse(
    responseMessage, updatedAttrs, "CheckClaimStatus", "Fulfilled"
  );
};