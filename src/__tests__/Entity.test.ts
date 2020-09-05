import {Entity} from "..";

describe("Entity", function () {
  class Empty extends Entity.Base {}

  class OneField extends Entity.Base {
    @Entity.Field()
    aField: string;
  }

  describe("Base", function () {
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
  });
});
