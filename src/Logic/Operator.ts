import {AsyncEvaluation, Evaluation} from "./Evaluation";

type TUnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type NewOperator<O, CTX> = O extends Operator<infer ACTX>
  ? Operator<TUnionToIntersection<CTX | ACTX>>
  : never;

export function async<CTX>(
  operatorPromise: () => Promise<Operator<CTX>>
): Operator<CTX> {
  return new AsyncOperator(operatorPromise);
}

export abstract class Operator<CTX = {}> {
  or<O extends Operator>(rule: O): NewOperator<O, CTX> {
    return new OrOperator(this, rule) as any;
  }

  orNot<O extends Operator>(rule: O): NewOperator<O, CTX> {
    return new OrOperator(this, rule.notThis()) as any;
  }

  xor<O extends Operator>(rule: O): NewOperator<O, CTX> {
    return new XorOperator(this, rule.notThis()) as any;
  }

  and<O extends Operator>(rule: O): NewOperator<O, CTX> {
    return new AndOperator(this, rule) as any;
  }

  andNot<O extends Operator>(rule: O): NewOperator<O, CTX> {
    return new AndOperator(this, rule.notThis()) as any;
  }

  notThis(): Operator<CTX> {
    return new NotOperator(this);
  }

  with(ctx: CTX): Operator<{}> {
    return new WithContextOperator(this, ctx);
  }

  runWith(ctx: CTX): AsyncEvaluation {
    return Evaluation.evaluateTree(evaluation => this.evaluate(ctx, evaluation))
  }

  abstract evaluate(ctx: CTX, evaluation: Evaluation): Promise<boolean>;
}

export class AsyncOperator<T> extends Operator<T> {
  constructor(private value: () => Promise<Operator<T>>) {
    super();
  }
  async evaluate(ctx: T, evaluation: Evaluation): Promise<boolean> {
    const operator = await this.value();
    return operator.evaluate(ctx, evaluation);
  }
}

export class WithContextOperator<T> extends Operator<{}> {
  constructor(private value: Operator<T>, private ctx: T) {
    super();
  }

  evaluate(_: T, evaluation: Evaluation): Promise<boolean> {
    return this.value.evaluate(this.ctx, evaluation);
  }
}

export class OrOperator<T> extends Operator<T> {
  constructor(private left: Operator<T>, private right: Operator<T>) {
    super();
  }
  async evaluate(ctx: T, evaluation: Evaluation): Promise<boolean> {
    if (await this.left.evaluate(ctx, evaluation)) {
      return true;
    }
    return await this.right.evaluate(ctx, evaluation);
  }
}

export class XorOperator<T> extends Operator<T> {
  constructor(private left: Operator<T>, private right: Operator<T>) {
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

export class AndOperator<T> extends Operator<T> {
  constructor(private left: Operator<T>, private right: Operator<T>) {
    super();
  }
  async evaluate(ctx: T, evaluation: Evaluation): Promise<boolean> {
    if (await this.left.evaluate(ctx, evaluation)) {
      return await this.right.evaluate(ctx, evaluation);
    }
    return false;
  }
}

export class NotOperator<T> extends Operator<T> {
  constructor(private value: Operator<T>) {
    super();
  }

  async evaluate(ctx: T, evaluation: Evaluation): Promise<boolean> {
    return !(await this.value.evaluate(ctx, evaluation));
  }
}
