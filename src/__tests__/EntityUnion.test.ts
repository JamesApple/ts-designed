/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Entity} from "..";
import "reflect-metadata";

describe("Entity union mapping", function () {
  enum Tags {
    A = "A",
    B = "B",
    C = "C"
  }

  class Aclass extends Entity.Base {
    myTag = Tags.A;

    @Entity.Field() myValue: string;
  }

  class Bclass extends Entity.Base {
    myTag = Tags.B;

    @Entity.Field() myNumber: number;
  }

  it("should create with no parameters", async function () {
    class Parent extends Entity.Base {
      @Entity.Field() item: Bclass | Aclass;
    }
    const {item} = Parent.fromJSON({item: {myTag: Tags.B, myNumber: 123}});
    expect(item.myTag).toEqual(Tags.B);
    expect((item as Bclass).myNumber).toEqual(123);
  });

  it("should create with no parameters", async function () {
    class Parent extends Entity.Base {
      @Entity.Field({
        taggedUnion: {
          getTag: (item: Bclass | Aclass) => item.myTag,
          handlers: {A: Aclass, B: Bclass, C: () => "manually returned"}
        }
      })
      item: Bclass | Aclass;
    }
    const {item} = Parent.fromJSON({item: {myTag: Tags.B, myNumber: 123}});

    expect(item.myTag).toEqual(Tags.B);
    expect(item).toBeInstanceOf(Bclass);
    expect((item as Bclass).myNumber).toEqual(123);

    const {item: secondItem} = Parent.fromJSON({
      item: {myTag: Tags.A, myValue: "321"}
    });

    expect(secondItem.myTag).toEqual(Tags.A);
    expect(secondItem).toBeInstanceOf(Aclass);
    expect((secondItem as Aclass).myValue).toEqual("321");

    const {item: nullItem} = Parent.fromJSON({});
    expect(nullItem).toBeUndefined();

    const {item: forcedItem} = Parent.fromJSON({item: {myTag: Tags.C}});
    expect(forcedItem).toEqual("manually returned");
  });
});
