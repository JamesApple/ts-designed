import {Logic} from "..";
import * as tsd from "tsd";

const error = new Error("I throw");
class True extends Logic.Rule<{}> {
  async satisfied(): Promise<boolean> {
    return true;
  }
}

class Throw extends Logic.Rule<{}> {
  async satisfied(): Promise<boolean> {
    throw error;
  }
}

class False extends Logic.Rule<{}> {
  async satisfied(): Promise<boolean> {
    return false;
  }
}

describe("Logic", () => {
  const t = new True();
  const f = new False();
  const thr = new Throw();

  it("Lets you evaluate rules", async function () {
    await expect(t.evaluate({})).resolves.toEqual(true);
    await expect(f.evaluate({})).resolves.toEqual(false);
    await expect(thr.evaluate({})).rejects.toEqual(error);
  });

  it("does basic ands", async function () {
    await expect(t.and(f).evaluate({})).resolves.toEqual(false);
    await expect(t.and(f).evaluate({})).resolves.toEqual(false);
    await expect(f.and(f).evaluate({})).resolves.toEqual(false);

    await expect(t.and(t).evaluate({})).resolves.toEqual(true);
  });

  it("Performs basic ors", async function () {
    await expect(t.or(f).evaluate({})).resolves.toEqual(true);
    await expect(f.or(t).evaluate({})).resolves.toEqual(true);

    await expect(t.or(thr).evaluate({})).resolves.toEqual(true);

    await expect(thr.or(thr).evaluate({})).rejects.toEqual(error);
    await expect(thr.or(f).evaluate({})).rejects.toEqual(error);
    await expect(thr.or(t).evaluate({})).rejects.toEqual(error);
  });

  it("performs negations", async function () {
    await expect(thr.notThis().evaluate({})).rejects.toEqual(error);
    await expect(f.notThis().evaluate({})).resolves.toEqual(true);
    await expect(t.andNot(f).evaluate({})).resolves.toEqual(true);
    await expect(f.orNot(f).evaluate({})).resolves.toEqual(true);
  });

  it("allows async rules", async function () {
    await expect(
      Logic.async(async () => thr).notThis().evaluate({})
    ).rejects.toEqual(error);
    await expect(
      Logic.async(async () => {
        return t;
      }).evaluate({})
    ).resolves.toEqual(true);

    await expect(
      Logic.async(async () => {
        return f;
      }).evaluate({})
    ).resolves.toEqual(false);
    await expect(
      Logic.async(async () => t).andNot(f).evaluate({})
    ).resolves.toEqual(true);
    await expect(f.orNot(f).evaluate({})).resolves.toEqual(true);
  });

  it("performs nested conditions", async function () {
    await expect(t.and(t.and(t.and(t).and(t))).evaluate({})).resolves.toEqual(
      true
    );
    await expect(
      t.and(t.and(t.and(t).andNot(t))).evaluate({})
    ).resolves.toEqual(false);

    await expect(t.and(t).or(t.and(f)).evaluate({})).resolves.toEqual(true);
    await expect(t.and(f).or(t.or(f)).evaluate({})).resolves.toEqual(true);
  });
});

xdescribe("Logic Types", () => {
  it("merges resolvers", async function () {
    class User extends Logic.Rule<{ctx: {userId: string}}> {
      satisfied(): Promise<boolean> {
        throw "";
      }
    }

    class Business extends Logic.Rule<{ctx: {businessId: string}}> {
      satisfied(): Promise<boolean> {
        throw "";
      }
    }

    class Another extends Logic.Rule<{
      ctx: {getId: () => string};
    }> {
      satisfied(): Promise<boolean> {
        throw "";
      }
    }

    const b = new Business();
    const u = new User();
    const a = new Another();

    //@ts-expect-error wrong
    b.or(u).or(a).evaluate({});

    b.or(u)
      .or(a)
      //@ts-expect-error mising userId
      .evaluate({ctx: {businessId: ""}});

    b.or(u)
      .or(a)
      //@ts-expect-error mising businessId
      .evaluate({ctx: {userId: "", businessId: ""}});

    b.or(u)
      .or(a)
      //@ts-expect-error mising businessId
      .evaluate({ctx: {userId: "", getId: () => ""}});

    b.or(u)
      .or(a)
      .evaluate({ctx: {businessId: "", userId: "", getId: () => ""}});

    tsd.expectType<
      (arg: {ctx: {userId: string; businessId: string}}) => Promise<boolean>
    >(b.or(u).evaluate);
  });

  it("allows you to provide a resolver for some part of the tree", async function () {
    class User extends Logic.Rule<{userId: string}> {
      satisfied(): Promise<boolean> {
        throw "";
      }
    }

    class Business extends Logic.Rule<{businessId: string}> {
      satisfied(): Promise<boolean> {
        throw "";
      }
    }

    const b = new Business();
    const u = Logic.async(async () => {
      return new User();
    });

    //@ts-expect-error Requires user Id
    b.with({businessId: ""}).and(u).evaluate({});

    b.with({businessId: ""}).and(u).evaluate({userId: ""});
  });
});
