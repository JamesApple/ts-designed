import "reflect-metadata";
import {Entity} from "..";

class Snake extends Entity.Base {
  static type: "SNAKE" = "SNAKE";
  @Entity.Field() type: "SNAKE";

  @Entity.Field() slithery: boolean;

  validate(): void {
    if (!this.slithery) {
      throw new Error("this slither is not slithery");
    }
  }
}

class Lizard extends Entity.Base {
  static type: "LIZARD" = "LIZARD";
  @Entity.Field() type: "LIZARD";

  @Entity.Field() lizardy: boolean;

  validate(): void {
    if (!this.lizardy) {
      throw new Error("this lizard is not lizardy");
    }
  }
}

class Creature extends Entity.Union.define({
  key: "type",
  entries: [Lizard, Snake]
}) {}

class Terrarium extends Entity.Base {
  @Entity.Field() favourite?: Creature;

  @Entity.Field({entity: Creature}) all?: Creature[];
}

test("It creates entities from its union config", async () => {
  const creature = Creature.create({type: "LIZARD", lizardy: true});
  expect(creature.is("LIZARD").isPresent()).toBeTruthy();
  expect(creature.is("SNAKE").isPresent()).toBeFalsy();
  expect(creature.value).toBeInstanceOf(Lizard);
  expect((creature.value as Lizard).lizardy).toEqual(true);

  const emptyTerrarium = Terrarium.create({});
  expect(emptyTerrarium.all).toBeUndefined();
  expect(emptyTerrarium.favourite).toBeUndefined();

  const terrarium = Terrarium.create({
    favourite: {
      // @ts-expect-error TS is confused as to why SNAKE has lizardy
      type: "SNAKE",
      slithery: true,
      lizardy: true
    }
  });

  expect(terrarium.favourite!.value).toBeInstanceOf(Snake);
  expect(terrarium.favourite!.value).toEqual({type: "SNAKE", slithery: true});

  expect(() =>
    Terrarium.create({
      //@ts-expect-error TS should be angry this has no tag
      favourite: {},
      all: []
    })
  ).not.toThrow();

  const flippedUpTerrarium = Terrarium.create({
    all: [
      {type: "LIZARD", lizardy: true},
      {
        type: "SNAKE",
        slithery: true
      },
      {
        //@ts-expect-error Still shouldnt want this
        type: "SNAKE",
        slithery: true,
        lizardy: true
      },
      //@ts-expect-error Should get angry given nothing in an object
      {},
      //@ts-expect-error Should get angry given an invalid tag in an object
      {type: "Pete"},
      //@ts-expect-error Should get angry given a string
      "Not a tag",
      //@ts-expect-error Should get angry given a boolean
      null
    ]
  });
  expect(flippedUpTerrarium.all![0].value).toBeInstanceOf(Lizard);
  expect(flippedUpTerrarium.all![1].value).toBeInstanceOf(Snake);
  expect(flippedUpTerrarium.all![2].value).toBeInstanceOf(Snake);
  expect(flippedUpTerrarium.all![3]).toBeUndefined();
  expect(flippedUpTerrarium.all![4]).toBeUndefined();
  expect(flippedUpTerrarium.all![5]).toBeUndefined();

  // TODO: This is likely invalid behaviour
  expect(flippedUpTerrarium.all![6]).toBeNull();
});

test("it validates after creating the object", () => {
  expect(() =>
    Terrarium.create({favourite: {type: "SNAKE", slithery: false}})
  ).toThrowErrorMatchingSnapshot();
});
