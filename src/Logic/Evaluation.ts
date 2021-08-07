import type {Rule} from "./Rule";

export class AsyncEvaluation implements PromiseLike<Evaluation> {
  constructor(private val: PromiseLike<Evaluation>) {}

  then<TResult1 = Evaluation, TResult2 = never>(
    onfulfilled?:
      | ((value: Evaluation) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.val.then(onfulfilled, onrejected);
  }

  get isTruthy(): Promise<boolean> {
    return (async () => {
      return await this.then((r) => r.isTruthy);
    })();
  }

  throw(
    cb: (args: {lastFalsy?: Falsy; falsy: Falsy[]; truthy: Rule[]}) => Error
  ): AsyncEvaluation {
    return new AsyncEvaluation(
      this.then((result) => {
        return result.throw(cb);
      })
    );
  }

  throwError<T extends {
    create(message?: string, other?: any): any;
  }>(klass: T): AsyncEvaluation {
    return new AsyncEvaluation(
      this.then((result) => {
        return result.throwError(klass);
      })
    );
  }
}

export type Falsy = {
  rule: Rule;
  cause: {
    message: string;
    details: Object;
  };
};

export class Evaluation {
  private readonly truthy: Rule[] = [];

  private readonly falsy: Falsy[] = [];

  private result: boolean;

  static evaluateTree(
    run: (evaluation: Evaluation) => Promise<boolean>
  ): AsyncEvaluation {
    return new AsyncEvaluation(
      (async () => {
        const evaluation = new Evaluation();
        evaluation.result = await run(evaluation);
        return evaluation;
      })()
    );
  }

  get isTruthy(): boolean {
    if (this.result == null) {
      throw new TypeError(
        "Designed: Evaluation result referenced before being evaluated"
      );
    }
    return this.result;
  }

  throwError(klass: {
    create(message?: string, other?: any): any;
  }): Evaluation {
    if (this.isTruthy) {
      return this;
    }
    throw klass.create(this.falsy[0]?.cause?.message, {
      details: this.falsy[0]?.cause?.message,
      rule: this.falsy[0]?.rule
    });
  }

  throw(
    cb: (args: {lastFalsy?: Falsy; falsy: Falsy[]; truthy: Rule[]}) => Error
  ): Evaluation {
    if (this.isTruthy) {
      return this;
    }
    throw cb({
      lastFalsy: this.falsy[0],
      falsy: this.falsy,
      truthy: this.truthy
    });
  }

  protected async evaluateRule(rule: Rule): Promise<boolean> {
    const result = await rule.satisfied();
    if (result === true) {
      this.truthy.unshift(rule);
      return true;
    }

    if (typeof result === "string") {
      this.falsy.unshift({rule, cause: {details: {}, message: result}});
    }

    if (typeof result === "object") {
      this.falsy.unshift({cause: result, rule});
    }

    return false;
  }
}
