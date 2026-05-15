// ── dynamoHelper.mjs ────────────────────────────────────────────
// Persists every Lex session turn to DynamoDB SentiChatSessions.

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { TABLE_NAME, AWS_REGION } from "./constants.mjs";

const dynamo = new DynamoDBClient({ region: AWS_REGION });

export async function saveSession({
  sessionId,
  intentName,
  sentiment,
  negativeScore,
  topConfidence,
  escalated,
  escalationReason,
  slots,
  sessionAttrs,
}) {
  const timestamp = new Date().toISOString();

  try {
    await dynamo.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
          sessionId        : { S: sessionId ?? "unknown" },
          timestamp        : { S: timestamp },
          intentName       : { S: intentName ?? "unknown" },
          sentiment        : { S: sentiment ?? "NEUTRAL" },
          negativeScore    : { N: (negativeScore ?? 0).toFixed(3) },
          topConfidence    : { N: (topConfidence ?? 0).toString() },
          escalated        : { BOOL: escalated ?? false },
          escalationReason : { S: escalationReason ?? "none" },
          slots            : { S: JSON.stringify(slots ?? {}) },
          sessionAttrs     : { S: JSON.stringify(sessionAttrs ?? {}) },
          ttl              : { N: String(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90) },
        },
      })
    );
    console.log(`✅ Session saved: ${sessionId} @ ${timestamp}`);
  } catch (err) {
    // Non-fatal — never break the chat experience
    console.error("❌ DynamoDB write failed:", err.message);
  }
}