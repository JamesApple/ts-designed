import {AsyncOperator} from "./AsyncOperator";
import type {Evaluation} from "./Evaluation";
import {Operator} from "./Operator";

type StringFailureMessage = string;
type DetailedFailureMessage = {message: string; details: Object};
type SuccessIndicator = boolean;
export type RuleResult =
  | StringFailureMessage
  | DetailedFailureMessage
  | SuccessIndicator;

export abstract class Rule<T = {}> extends Operator<T> {
  protected ctx: T;

  abstract satisfied(): RuleResult;

  evaluate(ctx: T, evaluation: Evaluation): boolean {
    this.ctx = ctx;
    return evaluation["evaluateRule"](this);
  }

  static of<T = {}>(rule: (ctx: T) => RuleResult | RuleResult): Rule<T> {
    const Klass = class extends Rule<T> {
      satisfied(): RuleResult {
        return rule(this.ctx);
      }
    };
    return new Klass();
  }

  static true(): Rule {
    return this.of(() => true);
  }

  static false(failure?: string): Rule {
    return this.of(() => failure ?? "Evaluation failed");
  }
}

export abstract class AsyncRule<T = {}> extends AsyncOperator<T> {
  protected ctx: T;

  abstract satisfied(): Promise<RuleResult>;

  evaluate(ctx: T, evaluation: Evaluation): Promise<boolean> {
    this.ctx = ctx;
    return evaluation["evaluateRuleAsync"](this);
  }

  static of<T = {}>(
    rule: (ctx: T) => Promise<RuleResult> | RuleResult
  ): AsyncRule<T> {
    const Klass = class extends AsyncRule<T> {
      async satisfied(): Promise<RuleResult> {
        return await rule(this.ctx);
      }
    };
    return new Klass();
  }

  static true(): AsyncRule {
    return this.of(() => true);
  }

  static false(failure?: string): AsyncRule {
    return this.of(() => failure ?? "Evaluation failed");
  }
}
