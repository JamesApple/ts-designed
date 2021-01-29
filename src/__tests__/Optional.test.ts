import {AbsentOptional, Optional, PresentOptional} from "../Optional";
import {AsyncOptional, PresentAsyncOptional} from "../Optional/AsyncOptional";
import {Result} from "../Result";

describe("Optional", function () {
  it("creates from null", async function () {
    const o = Optional.of<string | null>(null);
    expect(o.orElse("notThere")).toEqual("notThere");
    expect(o.map((s) => s.repeat(2))).toEqual(Optional.of(null));
    expect(o.orGet(() => "hi")).toEqual("hi");
    expect(o.flatMap((s) => Optional.of(s))).toEqual(Optional.of(null));
    expect(JSON.stringify(o)).toEqual("null");
    expect(() =>
      o.orThrow(() => {
        throw Error("thrown");
      })
    ).toThrowErrorMatchingInlineSnapshot(`"thrown"`);
  });

  it("creates from an optional", async function () {
    const original = "from optional";
    const o = Optional.of(Optional.of<string | undefined>(original));

    expect(o.orElse("notThere")).toEqual(original);
    expect(o.map((s) => s.repeat(2))).toEqual(Optional.of(original.repeat(2)));
    expect(o.orGet(() => "hi")).toEqual(original);
    expect(o.flatMap((s) => Optional.of(s))).toEqual(Optional.of(original));
    expect(JSON.stringify(o)).toEqual(`"${original}"`);
    o.orThrow(() => {
      throw Error("optional should not have thrown");
    });
  });

  it("creates from a value", async function () {
    const original = "from optional";
    const o = Optional.of(original);

    expect(o.orElse("notThere")).toEqual(original);
    expect(o.map((s) => s.repeat(2))).toEqual(Optional.of(original.repeat(2)));
    expect(o.orGet(() => "hi")).toEqual(original);
    expect(o.flatMap((s) => Optional.of(s))).toEqual(Optional.of(original));
    expect(JSON.stringify(o)).toEqual(`"${original}"`);
    o.orThrow(() => {
      throw Error("optional should not have thrown");
    });
  });

  it("lets you zip other optionals", async function () {
    const optional = Optional.of(1);
    expect(optional.zip(Optional.empty())).toBeInstanceOf(AbsentOptional);
    expect(optional.zip(Optional.of(2)).orElse(null)).toEqual([1, 2]);

    expect(
      optional.zip(Optional.of(2), Optional.of(3), Optional.of(4)).orElse(null)
    ).toEqual([1, 2, 3, 4]);

    expect(
      optional.zip(Optional.of(2), Optional.empty(), Optional.of(4))
    ).toBeInstanceOf(AbsentOptional);

    expect(Optional.empty().zip(Optional.of(1))).toBeInstanceOf(AbsentOptional);

    expect(Optional.empty().zip(Optional.of(1))).toBeInstanceOf(AbsentOptional);

    const testType: Optional<["FIRST", "SECOND", "THIRD"]> = Optional.of(
      "FIRST" as const
    ).zip(Optional.of("SECOND" as const), Optional.of("THIRD" as const));

    expect(testType.get()).toEqual(["FIRST", "SECOND", "THIRD"]);
    const asyncTest: Optional<[
      "FIRST",
      "SECOND",
      "THIRD",
      "FOURTH"
    ]> = await Optional.of("FIRST" as const)
      .mapAsync(async (i) => i)
      .zip(
        Promise.resolve(Optional.of("SECOND" as const)),
        AsyncOptional.of(Promise.resolve("THIRD" as const)),
        Optional.of("FOURTH" as const)
      );

    expect(asyncTest.get()).toEqual(["FIRST", "SECOND", "THIRD", "FOURTH"]);
  });
});

describe("Async Optional", function () {
  const tests: [
    name: string,
    action: (opt: Optional<number>) => Promise<any>,
    nulled: (nulled: any) => any,
    present: (present: any) => any
  ][] = [
    [
      "maps to async then gets",
      async (opt) => opt.mapAsync(async (n) => n + 1).get(),
      (nulled) => expect(nulled).toBeInstanceOf(TypeError),
      (present) => expect(present).toEqual(2)
    ],

    [
      "maps to async then orElses",
      async (opt) => opt.mapAsync(async (n) => n + 1).orElse(3),
      (nulled) => expect(nulled).toEqual(3),
      (present) => expect(present).toEqual(2)
    ],

    [
      "maps to async then orGets",
      async (opt) => opt.mapAsync(async (n) => n + 1).orGet(() => 3),
      (nulled) => expect(nulled).toEqual(3),
      (present) => expect(present).toEqual(2)
    ],

    [
      "maps to async then back to sync and orElses",
      async (opt) =>
        await opt.mapAsync(async (n) => n + 1).then((o) => o.orElse(3)),
      (nulled) => expect(nulled).toEqual(3),
      (present) => expect(present).toEqual(2)
    ],

    [
      "maps to async then back to sync and back to async",
      async (opt) =>
        await opt
          .mapAsync(async (n) => n + 1)
          .then((o) => o.mapAsync(async (a) => a)),
      (nulled) => expect(nulled.orElse(3)).toEqual(3),
      (present) => expect(present.orElse(3)).toEqual(2)
    ],

    [
      "maps to async then back to sync and back to async",
      async (opt) =>
        await opt
          .mapAsync(async (n) => n + 1)
          .then((o) => o.mapAsync(async (a) => a)),
      (nulled) => expect(nulled).toBeInstanceOf(AbsentOptional),
      (present) => expect(present).toBeInstanceOf(PresentOptional)
    ],

    [
      "throws the first encountered error in the async chain",
      async (opt) =>
        await opt
          .mapAsync(async (n) => n + 1)
          .map(() => {
            throw new Error("throws this one if present");
          })
          .orThrow(() => new Error("does not throw me")),
      (nulled) => expect(nulled).toEqual(new Error("does not throw me")),
      (present) =>
        expect(present).toEqual(new Error("throws this one if present"))
    ],

    [
      "uses the kitchen sink of maps",
      async (opt) =>
        await opt
          .mapAsync(async (n) => n + 1)
          .flatMapAsync(async (x) => Optional.of(x + 1))
          .flatMapAsync((x) =>
            PresentAsyncOptional.fromPromise(Promise.resolve(x + 1))
          )
          .map((n) => n + 1)
          .flatMap((n) => Optional.of(n + 1))
          .orElse("not present"),
      (nulled) => expect(nulled).toEqual("not present"),
      (present) => expect(present).toEqual(6)
    ],

    [
      "uses the kitchen sink of maps",
      async (opt) =>
        await opt
          .mapAsync(async (n) => n + 1)
          .flatMapAsync(async (x) => Optional.of(x + 1))
          .flatMapAsync((x) =>
            PresentAsyncOptional.fromPromise(Promise.resolve(x + 1))
          )
          .map((n) => n + 1)
          .flatMap((n) => Optional.of(n + 1))
          .orElse("not present"),
      (nulled) => expect(nulled).toEqual("not present"),
      (present) => expect(present).toEqual(6)
    ],

    [
      "filters in",
      async (opt) =>
        await opt
          .mapAsync(async (n) => n + 1)
          .filter((v) => v === 2)
          .orElse("not present"),
      (nulled) => expect(nulled).toEqual("not present"),
      (present) => expect(present).toEqual(2)
    ],

    [
      "filters out",
      async (opt) =>
        await opt
          .mapAsync(async (n) => n + 1)
          .filter((v) => v !== 2)
          .orElse("not present"),
      (nulled) => expect(nulled).toEqual("not present"),
      (present) => expect(present).toEqual("not present")
    ],

    [
      "zips in other async values and optional values",
      async (opt) =>
        await opt
          .mapAsync(async (x) => x)
          .zip(
            Optional.of(2),
            AsyncOptional.of(Promise.resolve(3)),
            Promise.resolve(Optional.of(4))
          )
          .orElse("not present"),
      (nulled) => expect(nulled).toEqual("not present"),
      (present) => expect(present).toEqual([1, 2, 3, 4])
    ],

    [
      "rejects on any zip rejection",
      async (opt) =>
        await opt
          .mapAsync(async (x) => x)
          .zip(
            Optional.of(2),
            Promise.reject(new Error("not possible")),
            Promise.resolve(Optional.of(4))
          )
          .orElse("not present"),
      (nulled) => expect(nulled).toEqual(new Error("not possible")),
      (present) => expect(present).toEqual(new Error("not possible"))
    ],
    [
      "allows using orElse to perform fallback behaviour",
      async (opt) => await opt.orElse(Promise.resolve(2)),
      (nulled) => expect(nulled).toEqual(2),
      (present) => expect(present).toEqual(1)
    ]
  ];

  tests.forEach(([name, action, nulled, present]) => {
    it(`${name} with an Optional.of(1)`, async function () {
      const r = await Result.fromPromise(action(Optional.of(1)));
      present(r.getEither());
    });

    it(`${name} with an Optional.empty()`, async function () {
      const r = await Result.fromPromise(action(Optional.empty()));
      nulled(r.getEither());
    });

    it(`${name} with an AsyncOptional.of(1)`, async function () {
      const r = await Result.fromPromise(
        action(AsyncOptional.of(Promise.resolve(1)) as any)
      );
      present(r.getEither());
    });

    it(`${name} with an AsyncOptional.empty()`, async function () {
      const r = await Result.fromPromise(action(AsyncOptional.empty() as any));
      nulled(r.getEither());
    });
  });
});
