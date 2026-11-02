import { describe, expect, it } from "vitest";
import { validateConfigurationCustomer } from "./finishValidation";

const messages = { required: "required", invalidEmail: "invalid" };

describe("validateConfigurationCustomer", () => {
  it("requires first name, last name and email", () => {
    expect(validateConfigurationCustomer({ firstName: "", lastName: " ", email: "", message: "" }, messages)).toEqual({
      firstName: "required",
      lastName: "required",
      email: "required",
    });
  });

  it("rejects an invalid email and accepts an optional message", () => {
    expect(validateConfigurationCustomer({
      firstName: "Max",
      lastName: "Mustermann",
      email: "max.example.at",
      message: "Bitte zurückrufen",
    }, messages)).toEqual({ email: "invalid" });
  });

  it("accepts a complete valid form", () => {
    expect(validateConfigurationCustomer({
      firstName: "Max",
      lastName: "Mustermann",
      email: "max@example.at",
      message: "",
    }, messages)).toEqual({});
  });
});
