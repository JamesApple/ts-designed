import {CreateArgs} from "./utilityTypes";
import {EntityMapping} from "./EntityMapping";

/**
 * `Base` should be extended to create your own domain entities.
 */
export class Base {
  static create<T extends typeof Base, D extends Object>(
    this: T,
    args?: CreateArgs<InstanceType<T>, D>
  ): InstanceType<T> {
    const instance = new this() as InstanceType<T>;
    new EntityMapping(instance, args).map();
    return instance;
  }
}
