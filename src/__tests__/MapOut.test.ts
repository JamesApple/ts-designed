import {Entity} from "../index";
import {MapOutArgs} from "../Entity/EntitySerializer";
import {WithoutFunctions} from "../Entity/utilityTypes";
describe("Entity.serialize().mapOut()", () => {
  class User extends Entity.Base {
    @Entity.Field()
    UserId: string;

    @Entity.Field()
    JoinedAt: Date;
  }

  class Profile extends Entity.Base {
    @Entity.Field()
    userId: string;

    @Entity.Field()
    joinedAt: string;
  }

  it("Lets you map between two similar types", function () {
    const user = User.create({data: {UserId: "1", Password: "Hello"}});
  });
});
