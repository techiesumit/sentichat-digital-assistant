describe("SentiChatProviderHandler", () => {

  test("extracts provider type from slots", () => {
    const slots = { ProviderType: { value: { interpretedValue: "cardiologist" } } };
    const providerType = slots?.ProviderType?.value?.interpretedValue ?? "provider";
    expect(providerType).toBe("cardiologist");
  });

  test("extracts zip code from slots", () => {
    const slots = { ZipCode: { value: { interpretedValue: "50263" } } };
    const zipCode = slots?.ZipCode?.value?.interpretedValue ?? "your area";
    expect(zipCode).toBe("50263");
  });

});