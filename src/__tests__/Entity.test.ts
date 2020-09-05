import {Entity} from "../Entity";

describe("Entity", function () {
  class AnEntity extends Entity.Base {}

  describe("Base", function () {
    it("should compile", async function () {
      AnEntity.create();
    });
  });
});
