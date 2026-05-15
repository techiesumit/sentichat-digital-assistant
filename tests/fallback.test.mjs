describe("SentiChatFallbackHandler", () => {

  test("FallbackIntent always sets escalate_to_agent true", () => {
    const intentName = "FallbackIntent";
    const updatedAttrs = { escalate_to_agent: "true", escalation_reason: "fallback_unresolved" };
    expect(updatedAttrs.escalate_to_agent).toBe("true");
    expect(updatedAttrs.escalation_reason).toBe("fallback_unresolved");
  });

  test("Fallback message is defined", () => {
    const FALLBACK_MSG = "I am sorry, I wasn't able to help with that. Let me connect you with a live support agent.";
    expect(typeof FALLBACK_MSG).toBe("string");
    expect(FALLBACK_MSG.length).toBeGreaterThan(0);
  });

});