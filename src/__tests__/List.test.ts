/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Entity} from "..";
import {EntityConfig} from "../Entity/EntityConfig";
import "reflect-metadata";

describe("List", function () {
  class NoMarkedFields extends Entity.Base {
    aField: string;
  }

  class NoMarkedFieldsList extends Entity.List.define(NoMarkedFields) {}

  class OneField extends Entity.Base {
    @Entity.Field() aField: string;
  }

  class OneFieldList extends Entity.List.define(OneField) {}

  describe("Mapping", function () {
    it("should use the @Entity.Field decorator to map a single attribute", async function () {
      const entity = OneFieldList.create([
        {
          aField: "a-value"
        }
      ]);

      expect(entity.asJSON()).toMatchObject([
        {
          aField: "a-value"
        }
      ]);

      expect([...entity]).toMatchObject([
        {
          aField: "a-value"
        }
      ]);
      expect(entity.filter(() => true)).toEqual(entity);
    });

    it("should not map fields that are not marked as fields", async function () {
      const entity = NoMarkedFieldsList.create([
        {
          aField: "aField"
        }
      ]);
      expect(entity[0]).not.toHaveProperty("aField");
      expect(entity).toEqual(new NoMarkedFieldsList({} as any));
    });
  });
});

describe("Mapping non entity classes", function () {
  class Child {
    name: string;

    asJSON(): string {
      return this.name;
    }

    static fromJSON(data: any): any {
      const child = new Child();
      child.name = data;
      return child;
    }
  }
  class List extends Entity.List.define(Child) {}

  it("serializes", async function () {
    expect(List.fromJSON(["Hello World"])[0]).toEqual(
      Child.fromJSON("Hello World")
    );
    expect(List.fromJSON(["Hello World"])).toMatchInlineSnapshot(`
      Array [
        "Hello World",
      ]
    `);
  });
});

describe("mapping arrays", function () {
  xit("Validates types", async function () {
    class Child extends Entity.Base {
      name: string;
      bingo?: string;
      child?: Child;
    }

    class MyList extends Entity.List.define(Child) {}

    class Parent extends Entity.Base {
      list: MyList;
      optionalList?: MyList;
      nullList?: MyList | null;
      blah: string;
    }

    Parent.create({
      blah: "",
      list: [{name: "hi"}]
    });

    //@ts-expect-error
    Parent.create({
      blah: ""
    });

    const listInstance = MyList.create([{name: "hi"}]);

    Parent.create({
      blah: "",
      list: listInstance
    });
  });
});
