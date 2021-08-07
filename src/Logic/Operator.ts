import {AsyncOptional} from "../Optional";
import {AsyncResult} from "../Result";

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

  abstract evaluate(resolver: CTX): Promise<boolean>;

  /*
   * Catches all evaluation errors
   */
  toResult(resolver: CTX, getError: () => Error): AsyncResult<true> {
    return AsyncResult.fromPromise((async () => this.evaluate(resolver))()).map(
      (result) => {
        if (result) {
          return result;
        }
        throw getError();
      }
    );
  }

  async orThrow(resolver: CTX, getError: () => Error): Promise<true> {
    return await this.toResult(resolver, getError).getOrThrowFailure();
  }

  /**
   * Will not catch errors
   */
  maybe(resolver: CTX): AsyncOptional<true> {
    return AsyncOptional.of(this.evaluate(resolver)).filter(
      (value): value is true => value
    );
  }
}

export class AsyncOperator<T> extends Operator<T> {
  constructor(private value: () => Promise<Operator<T>>) {
    super();
  }
  async evaluate(resolver: T): Promise<boolean> {
    const operator = await this.value()
    return operator.evaluate(resolver);
  }
}

export class WithContextOperator<T> extends Operator<{}> {
  constructor(private value: Operator<T>, private ctx: T) {
    super();
  }

  evaluate(): Promise<boolean> {
    return this.value.evaluate(this.ctx);
  }
}

export class OrOperator<T> extends Operator<T> {
  constructor(private left: Operator<T>, private right: Operator<T>) {
    super();
  }
  async evaluate(resolver: T): Promise<boolean> {
    if (await this.left.evaluate(resolver)) {
      return true;
    }
    return await this.right.evaluate(resolver);
  }
}

export class XorOperator<T> extends Operator<T> {
  constructor(private left: Operator<T>, private right: Operator<T>) {
    super();
  }
  async evaluate(resolver: T): Promise<boolean> {
    const [left, right] = await Promise.all([
      this.left.evaluate(resolver),
      this.right.evaluate(resolver)
    ]);
    return left === right;
  }
}

export class AndOperator<T> extends Operator<T> {
  constructor(private left: Operator<T>, private right: Operator<T>) {
    super();
  }
  async evaluate(resolver: T): Promise<boolean> {
    if (await this.left.evaluate(resolver)) {
      return await this.right.evaluate(resolver);
    }
    return false;
  }
}

export class NotOperator<T> extends Operator<T> {
  constructor(private value: Operator<T>) {
    super();
  }

  async evaluate(resolver: T): Promise<boolean> {
    return !(await this.value.evaluate(resolver));
  }
}
