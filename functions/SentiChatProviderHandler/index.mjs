// SentiChatProviderHandler — FindProvider intent fulfillment

import { buildResponse } from "/opt/nodejs/lexResponseBuilder.mjs";
import { saveSession } from "/opt/nodejs/dynamoHelper.mjs";
import {
  getSentiment, getNegativeScore, getTopNluConfidence,
  getSessionId, getSlots, getSessionAttrs,
} from "/opt/nodejs/sentimentRouter.mjs";

export const handler = async (event) => {
  console.log("ProviderHandler event:", JSON.stringify(event, null, 2));

  const sessionId     = getSessionId(event);
  const sessionAttrs  = getSessionAttrs(event);
  const slots         = getSlots(event);
  const sentiment     = getSentiment(event);
  const negativeScore = getNegativeScore(event);
  const topConfidence = getTopNluConfidence(event);

  const providerType = slots?.ProviderType?.value?.interpretedValue ?? "provider";
  const zipCode      = slots?.ZipCode?.value?.interpretedValue ?? "your area";

  console.log(`FindProvider — type: ${providerType}, zip: ${zipCode}`);

  // TODO Phase 2: Call Provider Directory API
  const responseMessage =
    `Searching for ${providerType} providers near ${zipCode}. ` +
    `Results are on the way.`;

  const updatedAttrs = {
    ...sessionAttrs,
    last_intent   : "FindProvider",
    provider_type : providerType,
    zip_code      : zipCode,
    sentiment     : sentiment,
  };

  await saveSession({
    sessionId,
    intentName       : "FindProvider",
    sentiment,
    negativeScore,
    topConfidence,
    escalated        : false,
    escalationReason : "none",
    slots,
    sessionAttrs     : updatedAttrs,
  });

  return buildResponse(responseMessage, updatedAttrs, "FindProvider", "Fulfilled");
};