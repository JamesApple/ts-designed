import {Optional} from "../Optional";

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
});
