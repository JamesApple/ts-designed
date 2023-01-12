import {Logic} from "..";
import * as tsd from "tsd";
import {Rule, RuleResult} from "../Logic/Rule";
import {DomainError} from "../DomainError";

const error = new Error("I throw");

class Throw extends Logic.AsyncRule<{}> {
  async satisfied(): Promise<Logic.RuleResult> {
    throw error;
  }
}

class False extends Logic.AsyncRule<{}> {
  async satisfied() {
    return "False";
  }
}

describe("Logic", () => {
  const t = Logic.AsyncRule.of(() => true);
  const f = new False();
  const thr = new Throw();

  it("Lets you runWith rules", async function () {
    await expect(t.runWith({}).isTruthy).resolves.toEqual(true);
    await expect(f.runWith({}).isTruthy).resolves.toEqual(false);
    await expect(thr.runWith({}).isTruthy).rejects.toEqual(error);
  });

  it("does basic ands", async function () {
    await expect(t.and(f).runWith({}).isTruthy).resolves.toEqual(false);
    await expect(t.and(f).runWith({}).isTruthy).resolves.toEqual(false);
    await expect(f.and(f).runWith({}).isTruthy).resolves.toEqual(false);

    await expect(t.and(t).runWith({}).isTruthy).resolves.toEqual(true);
  });

  it("Performs basic ors", async function () {
    await expect(t.or(f).runWith({}).isTruthy).resolves.toEqual(true);
    await expect(f.or(t).runWith({}).isTruthy).resolves.toEqual(true);

    await expect(t.or(thr).runWith({}).isTruthy).resolves.toEqual(true);

    await expect(thr.or(thr).runWith({}).isTruthy).rejects.toEqual(error);
    await expect(thr.or(f).runWith({}).isTruthy).rejects.toEqual(error);
    await expect(thr.or(t).runWith({}).isTruthy).rejects.toEqual(error);
  });

  it("performs negations", async function () {
    await expect(thr.notThis().runWith({}).isTruthy).rejects.toEqual(error);
    await expect(f.notThis().runWith({}).isTruthy).resolves.toEqual(true);
    await expect(t.andNot(f).runWith({}).isTruthy).resolves.toEqual(true);
    await expect(f.orNot(f).runWith({}).isTruthy).resolves.toEqual(true);
  });

  it("allows async rules", async function () {
    await expect(thr.notThis().runWith({})).rejects.toEqual(error);
    await expect(t.runWith({}).isTruthy).resolves.toEqual(true);

    await expect(f.runWith({}).isTruthy).resolves.toEqual(false);
    await expect(t.andNot(f).runWith({}).isTruthy).resolves.toEqual(true);
    await expect(f.orNot(f).runWith({}).isTruthy).resolves.toEqual(true);
  });

  it("performs nested conditions", async function () {
    await expect(
      t.and(t.and(t.and(t).and(t))).runWith({}).isTruthy
    ).resolves.toEqual(true);
    await expect(
      t.and(t.and(t.and(t).andNot(t))).runWith({}).isTruthy
    ).resolves.toEqual(false);

    await expect(t.and(t).or(t.and(f)).runWith({}).isTruthy).resolves.toEqual(
      true
    );
    await expect(t.and(f).or(t.or(f)).runWith({}).isTruthy).resolves.toEqual(
      true
    );
  });
});

xdescribe("Logic Types", () => {
  it("merges ctxs", async function () {
    class User extends Logic.AsyncRule<{ctx: {userId: string}}> {
      satisfied(): Promise<RuleResult> {
        throw new Error("Method not implemented.");
      }
    }

    class Business extends Logic.AsyncRule<{ctx: {businessId: string}}> {
      satisfied(): Promise<RuleResult> {
        throw new Error("Method not implemented.");
      }
    }

    class Another extends Logic.AsyncRule<{
      ctx: {getId: () => string};
    }> {
      satisfied(): Promise<Logic.RuleResult> {
        throw new Error("Method not implemented.");
      }
    }

    const b = new Business();
    const u = new User();
    const a = new Another();

    //@ts-expect-error wrong
    b.or(u).or(a).runWith({});

    b.or(u)
      .or(a)
      //@ts-expect-error mising userId
      .runWith({ctx: {businessId: ""}});

    b.or(u)
      .or(a)
      //@ts-expect-error mising businessId
      .runWith({ctx: {userId: "", businessId: ""}});

    b.or(u)
      .or(a)
      //@ts-expect-error mising businessId
      .runWith({ctx: {userId: "", getId: () => ""}});

    b.or(u)
      .or(a)
      .runWith({ctx: {businessId: "", userId: "", getId: () => ""}});

    tsd.expectType<
      (arg: {
        ctx: {userId: string; businessId: string};
      }) => Logic.AsyncEvaluation
    >(b.or(u).runWith);
  });

  it("allows you to provide a ctx for some part of the tree", async function () {
    class User extends Logic.AsyncRule<{userId: string}> {
      satisfied(): Promise<Logic.RuleResult> {
        throw new Error("Method not implemented.");
      }
    }

    class Business extends Logic.AsyncRule<{businessId: string}> {
      satisfied(): Promise<Logic.RuleResult> {
        throw new Error("Method not implemented.");
      }
    }

    const b = new Business();
    const u = new User();

    //@ts-expect-error Requires user Id
    b.with({businessId: ""}).and(u).runWith({});

    b.with({businessId: ""})
      .and(u)
      .runWith({userId: ""})
      .throwError(DomainError);
  });
});

describe("Bare rules", () => {
  it("Lets you define a rule", async function () {
    const userIdRule = Rule.of(
      (args: {userId?: string}) => !!args.userId || "Failed"
    );

    expect(await userIdRule.runWith({userId: "yes"}).isTruthy).toBeTruthy();
    expect(await userIdRule.runWith({}).isTruthy).toBeFalsy();
  });
});

describe("sync rules", () => {
  it("Lets you define a rule", async function () {
    expect(
      Logic.Rule.of(() => true)
        .or(Logic.Rule.of(() => false))
        .runWith({}).isTruthy
    ).toEqual(true);

    expect(
      () =>
        Logic.Rule.of(() => {
          throw new Error("I should exit execution");
        })
          .or(Logic.Rule.of(() => true))
          .runWith({}).isTruthy
    ).toThrowErrorMatchingInlineSnapshot(`"I should exit execution"`);
  });

  it("Lets you define a rule and map into the rule being async", async function () {
    await expect(
      Logic.AsyncRule.of(() => true)
        .or(Logic.Rule.of(() => false))
        .runWith({}).isTruthy
    ).resolves.toEqual(true);

    await expect(
      Logic.AsyncRule.of(() => false)
        .or(Logic.Rule.of(() => false))
        .runWith({}).isTruthy
    ).resolves.toEqual(false);

    await expect(
      Logic.Rule.of(() => true)
        .and(Logic.AsyncRule.of(async () => false))
        .runWith({}).isTruthy
    ).resolves.toEqual(false);

    await expect(
      Logic.Rule.of(() => false)
        .and(Logic.AsyncRule.of(async () => true))
        .runWith({}).isTruthy
    ).resolves.toEqual(false);
  });
});
