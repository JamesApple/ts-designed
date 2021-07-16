/* eslint-disable @typescript-eslint/explicit-function-return-type */
import "reflect-metadata";
import {Entity} from "..";

describe("EntityMapping", function () {
  class StringChild {
    value: string;

    static fromJSON(data: any) {
      if (typeof data !== "string") {
        throw new Error(`StringChild was passed ${data}`);
      }
      const instance = new StringChild();
      instance.value = data;
      return instance;
    }

    asJSON() {
      return this.value;
    }
  }

  class EntityChild extends Entity.Base {
    @Entity.Field() name: string;
  }

  class POJOChild {
    name: string;

    static fromJSON(data: any) {
      const instance = new POJOChild();
      instance.name = data.name;
      return instance;
    }

    asJSON() {
      return {name: this.name};
    }
  }

  class Parent extends Entity.Base {
    @Entity.Field() child: EntityChild;
  }

  class ParentPOJO extends Entity.Base {
    @Entity.Field() child: POJOChild;
  }

  class StringParent extends Entity.Base {
    @Entity.Field() child: StringChild;
  }

  const raw = {child: {name: "Steve"}} as any;

  describe("POJO", function () {
    it("Serializes an entity from a raw string", async function () {
      expect(ParentPOJO.create(raw).serialize().asJSON()).toEqual(raw);
    });

    it("Serializes an entity from a model", async function () {
      expect(
        ParentPOJO.create({child: POJOChild.fromJSON({name: "Steve"})})
          .serialize()
          .asJSON()
      ).toEqual(raw);
    });

    it("Serializes an entity from a nullish value", async function () {
      expect(
        ParentPOJO.create({
          child: null as any
        })
          .serialize()
          .asJSON()
      ).toStrictEqual({});
    });

    it("Serializes an entity from an undefined value", async function () {
      expect(ParentPOJO.build({}).serialize().asJSON()).toEqual({});
    });
  });

  describe("Entity", () => {
    it("Serializes an entity from a raw string", async function () {
      expect(Parent.create(raw).serialize().asJSON()).toEqual(raw);
    });

    it("Serializes an entity from a model", async function () {
      expect(
        Parent.create({
          child: EntityChild.create({name: "Steve"})
        })
          .serialize()
          .asJSON()
      ).toEqual(raw);
    });

    it("Serializes an entity from a nullish value", async function () {
      expect(
        Parent.create({
          child: null as any
        })
          .serialize()
          .asJSON()
      ).toEqual({});
    });

    it("Serializes an entity from an undefined value", async function () {
      expect(Parent.build({}).serialize().asJSON()).toEqual({});
    });
  });

  describe("Raw value serialization", () => {
    it("serializes raw values", async function () {
      const parent = StringParent.create({child: "string" as any});
      expect(parent.child).toBeInstanceOf(StringChild);
      expect(parent.serialize().asJSON()).toEqual({child: "string"});
    });

    it("does not serialize models with their fromJSON method", async function () {
      const parent = StringParent.create({
        child: StringChild.fromJSON("string")
      });
      expect(parent.child).toBeInstanceOf(StringChild);
      expect(parent.serialize().asJSON()).toEqual({child: "string"});
    });
  });

  describe("array serialization", function () {
    class Child extends Entity.Base {
      @Entity.Field() name: string;
    }
    class Parent extends Entity.Base {
      @Entity.Field({entity: Child}) children: Child[];
      @Entity.Field({iterable: true, entity: Child}) iterableChildren?: Child[];
    }

    it("serializes nested entities", async function () {
      const fromEntity = Parent.create({
        children: [
          Child.create({name: "first"}),
          Child.create({name: "second"})
        ]
      });

      expect(
        (fromEntity.serialize().asJSON().children as any)[0].constructor
      ).toEqual(Object);
      expect(fromEntity.serialize().asJSON()).toEqual({
        children: [{name: "first"}, {name: "second"}]
      });
    });

    it("serializes nested iterable entities", async function () {
      const fromEntity = Parent.build({
        iterableChildren: [
          Child.create({name: "first"}),
          Child.create({name: "second"})
        ]
      });

      expect(
        (fromEntity.serialize().asJSON().iterableChildren as any)[0].constructor
      ).toEqual(Object);
      expect(fromEntity.serialize().asJSON()).toEqual({
        iterableChildren: [{name: "first"}, {name: "second"}]
      });
    });

    it("creates from nested entities", async function () {
      const fromData = Parent.fromJSON({
        children: [{name: "first"}, {name: "second"}]
      });

      expect(fromData.children[0]).toBeInstanceOf(Child);
    });

    it("creates from iterable entities", async function () {
      const fromData = Parent.fromJSON({
        iterableChildren: [{name: "first"}, {name: "second"}]
      });

      expect(fromData.iterableChildren![0]).toBeInstanceOf(Child);
    });

    it("creates from null nested entities", async function () {
      Parent.build({}).serialize().asJSON();
    });
  });
});
