import {AsyncEvaluation, Evaluation} from "./Evaluation";

import type {Operator} from "./Operator";

type TUnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

// Must use "OperatorLike" instead of "Operator" to avoid circular dependency
interface AsyncOperatorLike<T = {}> {
  evaluate(ctx: T, evaluation: Evaluation): Promise<boolean>;
}

interface OperatorLike<T = {}> {
  evaluate(ctx: T, evaluation: Evaluation): boolean;
}

type NewOperator<O, CTX> = O extends AsyncOperatorLike<infer ACTX>
  ? AsyncOperator<TUnionToIntersection<CTX | ACTX>>
  : O extends OperatorLike<infer ACTX>
  ? AsyncOperator<TUnionToIntersection<CTX | ACTX>>
  : never;

type AnOperator<T = {}> = Operator<T> | AsyncOperator<T>;

type AnOperatorLike<T = {}> = OperatorLike<T> | AsyncOperatorLike<T>;

export abstract class AsyncOperator<CTX = {}> {
  or<O extends AnOperator>(rule: O): NewOperator<O, CTX> {
    return new OrOperator(this, rule) as any;
  }

  orNot<O extends AnOperator>(rule: O): NewOperator<O, CTX> {
    return new OrOperator(this, rule.notThis()) as any;
  }

  xor<O extends AnOperator>(rule: O): NewOperator<O, CTX> {
    return new XorOperator(this, rule.notThis()) as any;
  }

  and<O extends AnOperator>(rule: O): NewOperator<O, CTX> {
    return new AndOperator(this, rule) as any;
  }

  andNot<O extends AnOperator>(rule: O): NewOperator<O, CTX> {
    return new AndOperator(this, rule.notThis()) as any;
  }

  notThis(): AsyncOperator<CTX> {
    return new NotOperator(this);
  }

  with(ctx: CTX): AsyncOperator<{}> {
    return new WithContextOperator(this, ctx);
  }

  runWith(ctx: CTX): AsyncEvaluation {
    return AsyncEvaluation.evaluateTree((evaluation) =>
      this.evaluate(ctx, evaluation)
    );
  }

  abstract evaluate(ctx: CTX, evaluation: Evaluation): Promise<boolean>;
}

export class AnonymousAsyncOperator<CTX = {}> extends AsyncOperator<CTX> {
  constructor(private value: () => Promise<boolean>) {
    super();
  }

  async evaluate(_: CTX, evaluation: Evaluation): Promise<boolean> {
    return this.value();
  }
}

export class WithContextOperator<T> extends AsyncOperator<{}> {
  constructor(private value: AnOperator<T>, private ctx: T) {
    super();
  }

  async evaluate(_: T, evaluation: Evaluation): Promise<boolean> {
    return this.value.evaluate(this.ctx, evaluation);
  }
}

export class OrOperator<T> extends AsyncOperator<T> {
  constructor(private left: AnOperator<T>, private right: AnOperator<T>) {
    super();
  }

  async evaluate(ctx: T, evaluation: Evaluation): Promise<boolean> {
    if (await this.left.evaluate(ctx, evaluation)) {
      return true;
    }
    return await this.right.evaluate(ctx, evaluation);
  }
}

export class XorOperator<T> extends AsyncOperator<T> {
  constructor(private left: AnOperator<T>, private right: AnOperator<T>) {
    super();
  }
  async evaluate(ctx: T, evaluation: Evaluation): Promise<boolean> {
    const [left, right] = await Promise.all([
      this.left.evaluate(ctx, evaluation),
      this.right.evaluate(ctx, evaluation)
    ]);
    return left === right;
  }
}

export class AndOperator<T> extends AsyncOperator<T> {
  constructor(private left: AnOperator<T>, private right: AnOperator<T>) {
    super();
  }
  async evaluate(ctx: T, evaluation: Evaluation): Promise<boolean> {
    if (await this.left.evaluate(ctx, evaluation)) {
      return await this.right.evaluate(ctx, evaluation);
    }
    return false;
  }
}

export class NotOperator<T> extends AsyncOperator<T> {
  constructor(private value: AnOperator<T>) {
    super();
  }

  async evaluate(ctx: T, evaluation: Evaluation): Promise<boolean> {
    return !(await this.value.evaluate(ctx, evaluation));
  }
}
