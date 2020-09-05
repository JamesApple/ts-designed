import {Base} from "./Base";

export class EntityInitializationError extends Error {}

export type FieldConfiguration<
  T extends EntityConstructor = EntityConstructor
> =
  | {
      type: "nested_model";
      class: EntityConstructor;
    }
  | {type: "primitive"}
  | {
      type: "iterable_nested_model";
      iterableClass: IterableConstructor<T>;
      class: T;
    };

export interface EntityConstructor<T extends Base = Base> {
  new (): T;
}

export type EntityClass = typeof Base;

interface Iterable {
  [Symbol.iterator]: Function;
}

export interface IterableConstructor<T> {
  new (): Iterable;
  push(item: T): any;
}

export type WithoutFunctions<T> = Pick<
  T,
  {
    [Key in keyof T]: T[Key] extends Function ? never : Key;
  }[keyof T]
>;

export type MappingConfig<I extends Base, D extends Object> =
  | ({
      [K in keyof WithoutFunctions<I>]?: I[K] extends Base
        ? MappingConfig<I[K], D>
        : string;
    } & {mapFrom?: string})
  | {
      mapFrom?: string;
      mapTo?: (args: {rootData: D; data: Object | undefined}) => I;
    };

export type CreateArgs<I extends Base, D> =
  | SimpleCreateArgs<I>
  | MappedCreateArgs<I, D>;

export interface SimpleCreateArgs<I extends Base> {
  data: Partial<I>;
}

export interface MappedCreateArgs<I extends Base, D extends Object> {
  data: D;
  mapping: MappingConfig<I, D>;
}
