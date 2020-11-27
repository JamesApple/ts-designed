import {Entity} from "../index";

describe("Entity.serialize().mapOut()", () => {
  class User extends Entity.Base {
    @Entity.Field()
    UserId: string;

    @Entity.Field()
    JoinedAt: Date;

    @Entity.Field()
    same: string;
  }

  class Profile extends Entity.Base {
    @Entity.Field()
    userId: string;

    @Entity.Field()
    JoinedAt: string;

    @Entity.Field()
    same: string;
  }

  it("Lets you map between two similar types", function () {
    const user = User.create({
      UserId: "1",
      JoinedAt: new Date(),
      same: "value"
    });

    const profile = new Profile();
    user.serialize().mapOut<Profile>(
      profile,
      "same",
      {
        field: "JoinedAt",
        map: (d) => d.toISOString()
      },
      {
        from: "UserId",
        map: {to: "userId", with: (x) => x}
      }
    );

    expect(profile.userId).toEqual(user.UserId);
    expect(profile.JoinedAt).toEqual(user.JoinedAt.toISOString());
    expect(profile.same).toEqual(user.same);
  });
});
