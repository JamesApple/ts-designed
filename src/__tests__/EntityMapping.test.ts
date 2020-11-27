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
      ).toEqual({});
    });

    it("Serializes an entity from an undefined value", async function () {
      expect(ParentPOJO.create({}).serialize().asJSON()).toEqual({});
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
      expect(Parent.create({}).serialize().asJSON()).toEqual({});
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
});
