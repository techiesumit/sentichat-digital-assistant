describe("SentiChatClaimsHandler", () => {

  test("extracts claim number from slots", () => {
    const slots = { ClaimNumber: { value: { interpretedValue: "CLM123" } } };
    const claimNumber = slots?.ClaimNumber?.value?.interpretedValue ?? "unknown";
    expect(claimNumber).toBe("CLM123");
  });

  test("defaults to unknown when slot is missing", () => {
    const slots = {};
    const claimNumber = slots?.ClaimNumber?.value?.interpretedValue ?? "unknown";
    expect(claimNumber).toBe("unknown");
  });

});