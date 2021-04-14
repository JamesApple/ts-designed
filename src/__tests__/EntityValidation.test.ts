/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Entity} from "..";
import "reflect-metadata";

describe("EntityValidation", function () {
  const validationError = new Error("invalid");

  class Extended extends Entity.Base {
    validate() {
      throw validationError;
    }
  }

  class Child extends Extended {}

  class ChildWithOverride extends Extended {
    validate() {}
  }

  it("throws the validation error on create", () => {
    expect(() => Extended.create()).toThrowError(validationError);
  });

  it("throws the validation error on create for child", () => {
    expect(() => Child.create()).toThrowError(validationError);
  });

  it("throws the validation error on create for child", () => {
    expect(() => ChildWithOverride.create()).not.toThrowError();
  });
});
