import "reflect-metadata";
import {Entity} from "..";
import {Require} from "../Entity/utilityTypes";

class Tail {
  asJSON(): string {
    return "tails";
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static fromJSON(_: any): Tail {
    return new Tail();
  }
}

class Snake extends Entity.Base {
  static type: "SNAKE" = "SNAKE";
  @Entity.Field() type: "SNAKE";

  @Entity.Field() slithery: boolean;

  @Entity.Field() tail?: Tail;

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

class Creatures extends Entity.Base {
  @Entity.Field({entity: Creature}) creatures: Creature[];
}

class Terrarium extends Entity.Base {
  @Entity.Field() favourite?: Creature;

  @Entity.Field({entity: Creature}) all?: Creature[];
}


it('lets you provide the union directly', async function() {
  const c = Creature.create({
    type: 'SNAKE',
    slithery: true
  })

  expect( Creature.create(c) ).toBeInstanceOf(Creature)

  expect(Terrarium.create({})).toBeInstanceOf(Terrarium)

  expect(Terrarium.create({
    favourite: c
  })).toBeInstanceOf(Terrarium)

  expect(Terrarium.create({
    favourite: c.asJSON()
  })).toBeInstanceOf(Terrarium)
})

it('lets you perform complete case statements', async function() {
  //@ts-expect-error Should be required to enumerate all cases
  Creature.create({type: 'SNAKE', slithery: true}).allCases({
    SNAKE: () => ''
  })

  const cased = Creature.create({type: 'SNAKE', slithery: true}).allCases({
    SNAKE: (s) => s.type,
    LIZARD: (l) => l.type
  })
  expect(cased).toEqual('SNAKE')
})

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
      type: "SNAKE",
      slithery: true
    }
  });

  expect(terrarium.favourite!.value).toBeInstanceOf(Snake);
  expect(terrarium.favourite!.value).toEqual({type: "SNAKE", slithery: true});

  Terrarium.create({favourite: {type: "SNAKE", slithery: true, tail: "here"}});

  Terrarium.create({
    favourite: {type: "SNAKE", slithery: true, tail: new Tail()}
  });

  expect(() =>
    Terrarium.create({
      //@ts-expect-error TS should be angry this has no tag
      favourite: {},
      all: []
    })
  ).not.toThrow();

  type b = Entity.Union.Attributes<Creature>


  const c: b = {
    type: 'LIZARD',
    lizardy: true
  }

  const flippedUpTerrarium = Terrarium.create({
    all: [
      {type: "LIZARD", lizardy: true},
      {
        type: "SNAKE",
        slithery: true
      },
      {
        // TODO: This should fail as `lizardy` is not on `SNAKE`
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

test("it serializes the same as the entity itself", () => {
  expect(
    Terrarium.create({favourite: {type: "SNAKE", slithery: true}}).asJSON()
  ).toEqual({favourite: {type: "SNAKE", slithery: true}});
});

test("It accepts value objects", () => {
  class VO {
    constructor(private value: string) {}
    asJSON(): string {
      return this.value;
    }
    static fromJSON(data: any): VO {
      return new VO(data);
    }
  }

  class C extends Entity.Base {
    static type = "C";
    @Entity.Field() type = "C";
    @Entity.Field() vo?: VO;
  }
  class U extends Entity.Union.define({key: "type", entries: [C]}) {}

  U.create({type: "C", vo: "raw"});

  U.create({type: "C", vo: VO.fromJSON("")});
});

it("Accepts nested entities", async function () {
  class C extends Entity.Base {
    @Entity.Field() value?: string;
  }
  class P extends Entity.Base {
    static type = "P" as const;
    @Entity.Field() type: "P";
    @Entity.Field() child?: C;
  }

  class U extends Entity.Union.define({key: "type", entries: [P]}) {}

  U.create({type: "P", child: C.create({value: "hi"})});
});

it("Should be jsonable", async function () {
  const creatures = Creatures.create({
    creatures: [{type: "SNAKE", slithery: true}]
  });
  expect(JSON.stringify(creatures)).toEqual(
    JSON.stringify({creatures: [{type: "SNAKE", slithery: true}]})
  );

  expect(
    creatures
      .asJSON()
      .creatures.every(
        (creature) =>
          !(creature instanceof Entity.Base || creature instanceof Entity.Union)
      )
  ).toBeTruthy();
});


