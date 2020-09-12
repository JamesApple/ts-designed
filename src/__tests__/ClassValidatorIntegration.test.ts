import {IsString, validateSync} from "class-validator";
import {Entity} from "..";
import {Errors} from "..";

describe("ClassValidatorIntegration", function () {
  const AString: Partial<Entity.FieldConfigArgs> = {
    decorators: [IsString()]
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

  it("can create an from class validation errors", async function () {
    const error = Errors.EntityValidationError.fromClassValidatorErrors(
      validateSync(Person.build())
    );
    expect({...error}).toMatchInlineSnapshot(`
      Object {
        "apiCode": "VALIDATION_ERROR",
        "causes": Array [
          Object {
            "issue": "name must be a string",
            "path": "name",
          },
        ],
        "details": Object {},
        "longMessage": "A validation error occurred.",
        "statusCode": 500,
      }
    `);
  });
});
