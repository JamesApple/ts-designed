import {Entity} from "..";

describe("Serialization", function () {
  class OneField extends Entity.Base {
    @Entity.Field() name: string;
  }

  class TwoFields extends Entity.Base {
    @Entity.Field() name: string;

    @Entity.Field({entity: OneField}) theNested: OneField;
  }

  it("serializes a simple model", async function () {
    const entity = OneField.create({data: {name: "theName"}});
    expect(entity.serialize().asJSON()).toMatchInlineSnapshot(`
      Object {
        "name": "theName",
      }
    `);
  });

  it("does not output unset fields", async function () {
    const entity = OneField.create({data: {}});
    expect(entity.serialize().asJSON()).toMatchInlineSnapshot();
  });

  it("serializes nested entities", async function () {
    const entity = TwoFields.create({
      data: {
        name: "A Name"
      },
      mapping: {
        theNested: () => OneField.create({data: {name: "one"}})
      }
    });
    expect(entity.serialize().asJSON()).toMatchInlineSnapshot(`
      Object {
        "name": "A Name",
        "theNested": Object {
          "name": "one",
        },
      }
    `);
  });
});
