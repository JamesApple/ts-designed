import type {Evaluation} from "./Evaluation";
import {Operator} from "./Operator";

export type RuleResult = string | {message: string; details: Object} | true;

export abstract class Rule<T = {}> extends Operator<T> {
  protected ctx: T;

  abstract satisfied(): Promise<RuleResult>;

  async evaluate(ctx: T, evaluation: Evaluation): Promise<boolean> {
    this.ctx = ctx;
    return await evaluation["evaluateRule"](this);
  }

  static of<T = {}>(rule: (ctx: T) => Promise<RuleResult> | RuleResult): Rule<T> {
    const Klass = class extends Rule<T> {
      async satisfied(): Promise<RuleResult> {
        return rule(this.ctx)
      }
    }
    return new Klass()
  }

  static true(): Rule {
    return this.of(() => true)
  }

  static false(failure?: string): Rule {
    return this.of(() => failure ?? 'Evaluation failed')
  }
}
