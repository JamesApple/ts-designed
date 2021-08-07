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
}
