import {CreateArgs} from "./utilityTypes";

/**
 * `Base` should be extended to create your own domain entities.
 */
export class Base {
  static create<T extends typeof Base, D extends Object>(
    this: T,
    args: CreateArgs<InstanceType<T>, D> = {data: {}}
  ): InstanceType<T> {
    console.log(args);
    return new this() as InstanceType<T>;
  }
}
