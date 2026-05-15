// SentiChatBenefitsHandler — ExplainBenefits intent fulfillment

import { buildResponse } from "/opt/nodejs/lexResponseBuilder.mjs";
import { saveSession } from "/opt/nodejs/dynamoHelper.mjs";
import {
  getSentiment, getNegativeScore, getTopNluConfidence,
  getSessionId, getSlots, getSessionAttrs,
} from "/opt/nodejs/sentimentRouter.mjs";

export const handler = async (event) => {
  console.log("BenefitsHandler event:", JSON.stringify(event, null, 2));

  const sessionId     = getSessionId(event);
  const sessionAttrs  = getSessionAttrs(event);
  const slots         = getSlots(event);
  const sentiment     = getSentiment(event);
  const negativeScore = getNegativeScore(event);
  const topConfidence = getTopNluConfidence(event);

  const benefitType = slots?.BenefitType?.value?.interpretedValue ?? "your benefit";

  console.log(`ExplainBenefits — type: ${benefitType}`);

  // TODO Phase 2: Call Nova Pro + Bedrock Knowledge Base
  const responseMessage =
    `Let me pull up your ${benefitType} coverage details from your plan.`;

  const updatedAttrs = {
    ...sessionAttrs,
    last_intent  : "ExplainBenefits",
    benefit_type : benefitType,
    sentiment    : sentiment,
  };

  await saveSession({
    sessionId,
    intentName       : "ExplainBenefits",
    sentiment,
    negativeScore,
    topConfidence,
    escalated        : false,
    escalationReason : "none",
    slots,
    sessionAttrs     : updatedAttrs,
  });

  return buildResponse(responseMessage, updatedAttrs, "ExplainBenefits", "Fulfilled");
};