import {Operator} from "./Operator";


export abstract class Rule<T> extends Operator<T> {
  resolver: T;

  abstract satisfies(): Promise<boolean>;

  async evaluate(resolver: T): Promise<boolean> {
    this.resolver = resolver;
    return this.satisfies();
  }
}

