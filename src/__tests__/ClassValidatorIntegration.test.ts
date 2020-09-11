import {IsIn, validateSync} from "class-validator";
import {Entity} from "..";

describe("ClassValidatorIntegration", function () {
  const AString: Partial<Entity.FieldConfigArgs> = {
    decorators: [IsIn(["a"])]
  };

  class Person extends Entity.Base {
    @Entity.Field(AString)
    name: string;
  }

  afterEach(() => {
    Person.setValidator((e) => e);
  });

  it("does nothing if no validator function is registered", async function () {
    Person.create();
  });

  it("throws a validation error if a validation function is registered", async function () {
    Person.setValidator((entity) => {
      const errors = validateSync(entity);
      if (errors.length) throw new Error("model was invalid");
      return entity;
    });

    expect(() => Person.create()).toThrowErrorMatchingInlineSnapshot(
      `"model was invalid"`
    );
  });

  it("does not throw a validation error if a model is valid", async function () {
    Person.setValidator((entity) => {
      const errors = validateSync(entity);
      if (errors.length) throw new Error("model was invalid");
      return entity;
    });

    expect(() => Person.create()).toThrowErrorMatchingInlineSnapshot(
      `"model was invalid"`
    );
  });
});
