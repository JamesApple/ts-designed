/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {DomainError} from "..";

describe("DomainError", function () {
  class Parent extends DomainError {
    apiCode = 700;
  }
  class Subclass extends Parent {
    anotherField: string;
  }

  it("should wrap multiple errors", async function () {
    const root = new Error("Root Cause");
    const intermediate = Parent.wrap(root, {message: "Intermediate"});
    const final = Parent.wrap(intermediate, {message: "Final"});

    expect(final.getCause()).toEqual(intermediate);
    expect(final.getRootCause()).toEqual(root);
    expect(final.getPreviousErrors()).toEqual([intermediate, root]);
    expect(final.name).toMatchInlineSnapshot(`"Parent(Parent(Error))"`);
    expect(final.toString()).toMatchInlineSnapshot(`
      "Parent: Final
      	Parent: Intermediate
      	Error: Root Cause"
    `);
  });

  it("should add details", async function () {
    const err = Parent.create("an Error", {
      apiCode: 400,
      details: {
        some: "context"
      }
    });

    expect(err.details).toMatchInlineSnapshot(`
      Object {
        "some": "context",
      }
    `);
    expect({...err}).toMatchInlineSnapshot(`
      Object {
        "apiCode": 400,
        "details": Object {
          "some": "context",
        },
      }
    `);
  });

  it("should have the correct instance chain", async function () {
    const subclass = Subclass.create("subclass");
    const parent = Parent.create("parent");
    const base = DomainError.create("base");

    mustBeInstanceOfAll(base, Error, DomainError);
    mustBeInstanceOfAll(parent, Error, DomainError, Parent);
    mustBeInstanceOfAll(subclass, DomainError, Subclass, Error, Parent);
  });

  it("TYPES: should be allow subclasses to be assignable to a function that requires an error", async function () {
    const takesErrClass = (_: typeof Error) => {};
    const takesBaseClass = (_: typeof Parent) => {};

    const takesError = (_: Error) => {};
    const takesBase = (_: Parent) => {};

    const subclass = Subclass.create("subclass");
    const parent = Parent.create("parent");
    const base = DomainError.create("base");

    takesError(base);
    takesError(parent);
    takesError(subclass);

    takesBase(parent);
    takesBase(subclass);

    takesErrClass(Error);
    // FAIL: Error type is far too strict
    // takesErrClass(Parent);
    takesBaseClass(Parent);
    takesBaseClass(Subclass);
  });
});

function mustBeInstanceOfAll(
  instance: any,
  ...instanceConstructors: any[]
): void {
  instanceConstructors.forEach((constructor) => {
    expect(instance).toBeInstanceOf(constructor);
  });
}
