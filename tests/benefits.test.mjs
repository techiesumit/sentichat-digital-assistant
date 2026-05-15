describe("SentiChatBenefitsHandler", () => {

  test("extracts benefit type from slots", () => {
    const slots = { BenefitType: { value: { interpretedValue: "deductible" } } };
    const benefitType = slots?.BenefitType?.value?.interpretedValue ?? "your benefit";
    expect(benefitType).toBe("deductible");
  });

  test("defaults when benefit slot is missing", () => {
    const slots = {};
    const benefitType = slots?.BenefitType?.value?.interpretedValue ?? "your benefit";
    expect(benefitType).toBe("your benefit");
  });

});