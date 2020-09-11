import {CreateArgs} from "./utilityTypes";
import {EntityMapping} from "./EntityMapping";

export class Base {
  /**
   * Map then validate an entity
   */
  static create<T extends typeof Base, D extends Object>(
    this: T,
    args?: CreateArgs<InstanceType<T>, D>
  ): InstanceType<T> {
    const instance = this.build(args);
    this.validator(instance);
    return instance;
  }

  /*
   * Map an entity
   */
  static build<T extends typeof Base, D extends Object>(
    this: T,
    args?: CreateArgs<InstanceType<T>, D>
  ): InstanceType<T> {
    const instance = new this() as InstanceType<T>;
    new EntityMapping(instance, args).map();
    return instance;
  }

  private static validator = <T extends Base>(entity: T): T => entity;
  static setValidator<T extends typeof Base>(
    this: T,
    validator: typeof this.validator
  ): void {
    this.validator = validator;
  }
}
