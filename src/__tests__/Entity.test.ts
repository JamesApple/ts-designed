import {Entity} from "..";

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

    it("should use the @Field decorator to map a single attribute", async function () {
      const entity = OneField.create({
        data: {aField: "a-value"}
      });

      expect(entity).toMatchObject({
        aField: "a-value"
      });
    });

    it("maps directly by name", async function () {
      const entity = OneField.create({
        data: {
          doesNotMatch: "a-value"
        },
        mapping: {
          aField: "doesNotMatch"
        }
      });

      expect(entity).toMatchObject({
        aField: "a-value"
      });
    });

    it("maps directly by path", async function () {
      const entity = OneField.create({
        data: {
          aNestedObject: {
            doesNotMatch: "a-value"
          }
        },
        mapping: {
          aField: "aNestedObject.doesNotMatch"
        }
      });

      expect(entity).toMatchObject({
        aField: "a-value"
      });
    });

    it("maps by function", async function () {
      const data = {
        some: "data we ignore"
      };
      const entity = OneField.create({
        data,
        mapping: {
          aField: (_, {instance, data: passedData}) => {
            expect(data).toEqual(passedData);
            expect(instance).toBeInstanceOf(OneField);
            return "a-value";
          }
        }
      });

      expect(entity).toMatchObject({
        aField: "a-value"
      });
    });

    it("maps by function and passes in the same field", async function () {
      const data = {
        some: "data we ignore",
        aField: "passed-from-data"
      };
      const entity = OneField.create({
        data,
        mapping: {
          aField: (passed) => passed as string
        }
      });

      expect(entity).toMatchObject({
        aField: "passed-from-data"
      });
    });

    it("should not map fields that are not marked as fields", async function () {
      const entity = NoMarkedFields.create({
        data: {aField: "aField"}
      });
      expect(entity).not.toHaveProperty("aField");
    });

    it("should not throw if a dot syntax getter returns undefined", async function () {
      const entity = OneField.build({
        data: {},
        mapping: {aField: "a.b.c"}
      });

      expect(entity).toHaveProperty("aField", undefined);
    });
  });
});
