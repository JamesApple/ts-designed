import {Entity} from "..";

describe("Serialization", function () {
  class OneField extends Entity.Base {
    @Entity.Field() name: string;
  }

  it("serializes a simple model", async function () {
    const entity = OneField.create({name: "theName"});
    expect(entity.serialize().asJSON()).toMatchInlineSnapshot(`
      Object {
        "name": "theName",
      }
    `);
  });

  it("does not output unset fields", async function () {
    const entity = OneField.build({});
    expect(entity.serialize().asJSON()).toMatchInlineSnapshot(`Object {}`);
  });
});
