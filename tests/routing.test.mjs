describe("SentiChat Routing Logic", () => {

  test("NEGATIVE sentiment with FallbackIntent should escalate", () => {
    const intentName    = "FallbackIntent";
    const sentiment     = "NEGATIVE";
    const negativeScore = 0.9985;
    let shouldEscalate   = false;
    let escalationReason = null;
    if (intentName === "FallbackIntent" && sentiment === "NEGATIVE") {
      shouldEscalate   = true;
      escalationReason = "fallback_with_negative_sentiment";
    }
    expect(shouldEscalate).toBe(true);
    expect(escalationReason).toBe("fallback_with_negative_sentiment");
  });

  test("POSITIVE sentiment should not escalate", () => {
    const sentiment     = "POSITIVE";
    const negativeScore = 0.01;
    const shouldEscalate = sentiment === "NEGATIVE" && negativeScore >= 0.75;
    expect(shouldEscalate).toBe(false);
  });

  test("High negative score should escalate", () => {
    const sentiment     = "NEGATIVE";
    const negativeScore = 0.92;
    const shouldEscalate = sentiment === "NEGATIVE" && negativeScore >= 0.75;
    expect(shouldEscalate).toBe(true);
  });

  test("Low NLU confidence should escalate", () => {
    const topConfidence = 0.24;
    const shouldEscalate = topConfidence < 0.40;
    expect(shouldEscalate).toBe(true);
  });

  test("High NLU confidence should not escalate", () => {
    const topConfidence = 0.85;
    const shouldEscalate = topConfidence < 0.40;
    expect(shouldEscalate).toBe(false);
  });

});