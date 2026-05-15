// ── Routing thresholds ──────────────────────────────────────────
export const NEGATIVE_SCORE_THRESHOLD = 0.75;
export const LOW_CONFIDENCE_THRESHOLD = 0.40;
export const ESCALATE_ALWAYS_INTENTS  = [];

// ── AWS Config ──────────────────────────────────────────────────
export const TABLE_NAME  = "SentiChatSessions";
export const AWS_REGION  = "us-east-1";

// ── Messages ────────────────────────────────────────────────────
export const MESSAGES = {
  ESCALATION:
    "I can see you need more help than I can provide right now. " +
    "Let me connect you with a live support agent who can assist you. " +
    "Please hold on for just a moment.",

  FALLBACK:
    "I'm sorry, I wasn't able to help with that. " +
    "Let me connect you with a live support agent.",

  CLAIMS_PLACEHOLDER:
    "I found your claim information. An agent will provide full details shortly.",

  PROVIDER_PLACEHOLDER:
    "Results are on the way for providers in your area.",

  BENEFITS_PLACEHOLDER:
    "Let me pull up your coverage details from your plan.",
};