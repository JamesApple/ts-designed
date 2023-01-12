import {AsyncOperator} from "./AsyncOperator";
import * as async from "./AsyncOperator";
import {Evaluation} from "./Evaluation";

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

type NewOperator<O, CTX> = O extends OperatorLike<infer ACTX>
  ? Operator<TUnionToIntersection<CTX | ACTX>>
  : O extends AsyncOperatorLike<infer ACTX>
  ? AsyncOperator<TUnionToIntersection<CTX | ACTX>>
  : never;

type AnOperator<T = {}> = AsyncOperator<T> | Operator<T>;

export abstract class Operator<CTX = {}> {
  or<O extends AnOperator>(rule: O): NewOperator<O, CTX> {
    if (rule instanceof AsyncOperator) {
      return new async.OrOperator(this, rule) as any;
    }
    return new OrOperator(this, rule) as any;
  }

  orNot<O extends AnOperator>(rule: O): NewOperator<O, CTX> {
    if (rule instanceof AsyncOperator) {
      return new async.OrOperator(this, rule.notThis()) as any;
    }
    return new OrOperator(this, rule.notThis()) as any;
  }

  xor<O extends AnOperator>(rule: O): NewOperator<O, CTX> {
    if (rule instanceof AsyncOperator) {
      return new async.XorOperator(this, rule.notThis()) as any;
    }
    return new XorOperator(this, rule.notThis()) as any;
  }

  and<O extends AnOperator>(rule: O): NewOperator<O, CTX> {
    if (rule instanceof AsyncOperator) {
      return new async.AndOperator(this, rule) as any;
    }
    return new AndOperator(this, rule) as any;
  }

  andNot<O extends AnOperator>(rule: O): NewOperator<O, CTX> {
    if (rule instanceof AsyncOperator) {
      return new async.AndOperator(this, rule.notThis()) as any;
    }
    return new AndOperator(this, rule.notThis()) as any;
  }

  notThis(): Operator<CTX> {
    return new NotOperator(this);
  }

  with(ctx: CTX): Operator<{}> {
    return new WithContextOperator(this, ctx);
  }

  runWith(ctx: CTX): Evaluation {
    return Evaluation.evaluateTree((evaluation) =>
      this.evaluate(ctx, evaluation)
    );
  }

  abstract evaluate(ctx: CTX, evaluation: Evaluation): boolean;
}

export class WithContextOperator<T> extends Operator<{}> {
  constructor(private value: Operator<T>, private ctx: T) {
    super();
  }

  evaluate(_: T, evaluation: Evaluation): boolean {
    return this.value.evaluate(this.ctx, evaluation);
  }
}

export class OrOperator<T> extends Operator<T> {
  constructor(private left: Operator<T>, private right: Operator<T>) {
    super();
  }
  evaluate(ctx: T, evaluation: Evaluation): boolean {
    if (this.left.evaluate(ctx, evaluation)) {
      return true;
    }
    return this.right.evaluate(ctx, evaluation);
  }
}

export class XorOperator<T> extends Operator<T> {
  constructor(private left: Operator<T>, private right: Operator<T>) {
    super();
  }
  evaluate(ctx: T, evaluation: Evaluation): boolean {
    return (
      this.left.evaluate(ctx, evaluation) ===
      this.right.evaluate(ctx, evaluation)
    );
  }
}

export class AndOperator<T> extends Operator<T> {
  constructor(private left: Operator<T>, private right: Operator<T>) {
    super();
  }
  evaluate(ctx: T, evaluation: Evaluation): boolean {
    if (this.left.evaluate(ctx, evaluation)) {
      return this.right.evaluate(ctx, evaluation);
    }
    return false;
  }
}

export class NotOperator<T> extends Operator<T> {
  constructor(private value: Operator<T>) {
    super();
  }

  evaluate(ctx: T, evaluation: Evaluation): boolean {
    return !this.value.evaluate(ctx, evaluation);
  }
}
