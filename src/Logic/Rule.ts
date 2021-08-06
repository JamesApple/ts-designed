import {Operator} from "./Operator";


export abstract class Rule<T> extends Operator<T> {
  protected resolver: T;

  abstract satisfied(): Promise<boolean>;

  async evaluate(resolver: T): Promise<boolean> {
    this.resolver = resolver;
    return this.satisfied();
  }
}

