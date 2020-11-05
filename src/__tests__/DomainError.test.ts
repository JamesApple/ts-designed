import {DomainError} from "..";

describe("DomainError", function () {
  class MyError extends DomainError {
    apiCode = 700;
  }

  it("should wrap multiple errors", async function () {
    const root = new Error("Root Cause");
    const intermediate = MyError.wrap(root, "Intermediate");
    const final = MyError.wrap(intermediate, "Final");

    expect(final.getCause()).toEqual(intermediate);
    expect(final.getRootCause()).toEqual(root);
    expect(final.getPreviousErrors()).toEqual([intermediate, root]);
    expect(final.name).toMatchInlineSnapshot(`"MyError(MyError(Error))"`);
    expect(final.toString()).toMatchInlineSnapshot(`
      "MyError: Final
      	MyError: Intermediate
      	Error: Root Cause"
    `);
  });

  it("should add details", async function () {
    const err = MyError.create("an Error", {
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
});
