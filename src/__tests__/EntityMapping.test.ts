import {Entity} from "..";

describe("EntityMapping", function () {
  class EntityChild extends Entity.Base {
    @Entity.Field() name: string;

    static fromJSON(data: any) {
      return EntityChild.create({data});
    }

    asJSON() {
      return this.serialize().asJSON();
    }
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

  const raw = {child: {name: "Steve"}} as any;

  describe("POJO", function () {
    it("Serializes an entity from a raw string", async function () {
      expect(ParentPOJO.create({data: raw}).serialize().asJSON()).toEqual(raw);
    });

    it("Serializes an entity from a model", async function () {
      expect(
        ParentPOJO.create({
          data: {child: POJOChild.fromJSON({name: "Steve"})}
        })
          .serialize()
          .asJSON()
      ).toEqual(raw);
    });

    it("Serializes an entity from a nullish value", async function () {
      expect(
        ParentPOJO.create({
          data: {child: null as any}
        })
          .serialize()
          .asJSON()
      ).toEqual({});
    });

    it("Serializes an entity from an undefined value", async function () {
      expect(
        ParentPOJO.create({
          data: {}
        })
          .serialize()
          .asJSON()
      ).toEqual({});
    });
  });

  describe("Entity", () => {
    it("Serializes an entity from a raw string", async function () {
      expect(Parent.create({data: raw}).serialize().asJSON()).toEqual(raw);
    });

    it("Serializes an entity from a model", async function () {
      expect(
        Parent.create({
          data: {child: EntityChild.create({data: {name: "Steve"}})}
        })
          .serialize()
          .asJSON()
      ).toEqual(raw);
    });

    it("Serializes an entity from a nullish value", async function () {
      expect(
        Parent.create({
          data: {child: null as any}
        })
          .serialize()
          .asJSON()
      ).toEqual({});
    });

    it("Serializes an entity from an undefined value", async function () {
      expect(
        Parent.create({
          data: {}
        })
          .serialize()
          .asJSON()
      ).toEqual({});
    });
  });
});
