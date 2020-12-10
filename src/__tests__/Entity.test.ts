/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Entity} from "..";
import {EntityConfig} from "../Entity/EntityConfig";
import "reflect-metadata";

describe("Entity", function () {
  class Empty extends Entity.Base {}

  class OneField extends Entity.Base {
    @Entity.Field()
    aField: string;
  }

  class NoMarkedFields extends Entity.Base {
    aField: string;
  }

  describe("Mapping", function () {
    it("should create with no parameters", async function () {
      Empty.create();
    });

    it("should use the @Entity.Field decorator to map a single attribute", async function () {
      const entity = OneField.create({
        aField: "a-value"
      });

      expect(entity).toMatchObject({
        aField: "a-value"
      });
    });

    it("should not map fields that are not marked as fields", async function () {
      const entity = NoMarkedFields.create({
        aField: "aField"
      });
      expect(entity).not.toHaveProperty("aField");
      expect(entity).toEqual(new NoMarkedFields());
    });
  });
});

describe("Entity Inheritance", () => {
  class Parent extends Entity.Base {
    @Entity.Field() value: string;
  }

  class Child extends Parent {
    @Entity.Field() childValue: string;
  }

  it("PRIVATE: Does not use the same entity config  as its parent", async function () {
    expect(EntityConfig.forConstructor(Parent)).not.toEqual(
      EntityConfig.forConstructor(Child)
    );
  });

  it("does not inherit child fields", async function () {
    const expected = new Parent();
    expected.value = "parent field";

    expect(
      Parent.create({
        value: "parent field",
        //@ts-ignore
        childValue: "child field"
      })
    ).toEqual(expected);
  });

  it("inherits its parents fields", async function () {
    const expected = new Child();
    expected.value = "parent field";
    expected.childValue = "child field";

    expect(
      Child.create({
        value: "parent field",
        childValue: "child field"
      })
    ).toEqual(expected);
  });
});

describe("Entity Inheritance Overriding", () => {
  class Field {}
  class FieldSubclass {}

  class Parent extends Entity.Base {
    @Entity.Field({entity: Field}) myField: Field;
  }

  class Child extends Parent {
    @Entity.Field({entity: FieldSubclass}) myField: FieldSubclass;
  }

  it("does not use the parents field config if it is overwritten", async function () {
    expect(
      EntityConfig.forConstructor(Parent).getFields()[0].reflectedEntity
    ).not.toStrictEqual(
      EntityConfig.forConstructor(Child).getFields()[0].reflectedEntity
    );

    expect(
      EntityConfig.forConstructor(Parent).getFields()[0].entity
    ).not.toStrictEqual(
      EntityConfig.forConstructor(Child).getFields()[0].entity
    );
  });
});

describe("Entity Deserialization", function () {
  class Mine extends Entity.Base {
    @Entity.Field({deserialize: (json) => JSON.parse(json)}) parsedData: Object;
  }

  it("uses the deserialization method", async function () {
    expect(
      Mine.create({
        parsedData: JSON.stringify({some: "data"})
      })
    ).toMatchInlineSnapshot(`
      Object {
        "parsedData": Object {
          "some": "data",
        },
      }
    `);
  });
});

describe("maybe", function () {
  class HasOptionalField extends Entity.Base {
    @Entity.Field() field?: string;
  }

  it("will return an optional of the value", async function () {
    expect(
      HasOptionalField.create({field: "value"}).maybe("field").get()
    ).toEqual("value");
  });

  it("will return an optional of no value", async function () {
    expect(HasOptionalField.create({}).maybe("field").isAbsent()).toEqual(true);
  });
});

describe("Mapping non entity classes", function () {
  class Child {
    name: string;

    static fromJSON(data: any): any {
      const child = new Child();
      child.name = data;
      return child;
    }
  }
  class Parent extends Entity.Base {
    @Entity.Field() child: Child;
  }

  it("serializes", async function () {
    expect(Parent.fromJSON({child: "Hello World"} as any))
      .toMatchInlineSnapshot(`
      Object {
        "child": Child {
          "name": "Hello World",
        },
      }
    `);
  });
});
