import {Entity} from "..";

describe.only("Entity", function () {
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
    });
  });
});
