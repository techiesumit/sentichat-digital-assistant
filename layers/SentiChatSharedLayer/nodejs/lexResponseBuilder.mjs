// ── lexResponseBuilder.mjs ──────────────────────────────────────
// Builds standardized Lex V2 response objects.

export function buildResponse(message, sessionAttrs, intentName, intentState) {
  const response = {
    sessionState: {
      dialogAction     : { type: "Close" },
      intent           : { name: intentName, state: intentState },
      sessionAttributes: sessionAttrs,
    },
  };
  if (message)
    response.messages = [{ contentType: "PlainText", content: message }];
  return response;
}

export function buildEscalationAttrs(sessionAttrs, sentiment, negativeScore, escalationReason) {
  return {
    ...sessionAttrs,
    escalate_to_agent : "true",
    escalation_reason : escalationReason,
    sentiment         : sentiment,
    negative_score    : negativeScore.toFixed(3),
  };
}

export function buildContinueResponse(sessionAttrs, intentName) {
  return {
    sessionState: {
      dialogAction     : { type: "Delegate" },
      intent           : { name: intentName },
      sessionAttributes: sessionAttrs,
    },
  };
}