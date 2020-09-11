import {CreateArgs} from "./utilityTypes";
import {EntityMapping} from "./EntityMapping";

export class Base {
  static validate = <T extends Base>(v: T): T => v;
  validate: typeof Base.validate = Base.validate;

  /**
   * Map, then validate an entity
   */
  static create<T extends typeof Base, D extends Object>(
    this: T,
    args?: CreateArgs<InstanceType<T>, D>
  ): InstanceType<T> {
    const instance = this.build(args);
    instance.validate;
    return instance;
  }

  /**
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
}
