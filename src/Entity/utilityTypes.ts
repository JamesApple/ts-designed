import {Optional} from "../Optional";
import {Base} from "./Base";

export class EntityInitializationError extends Error {}

export type WithoutFunctions<T> = Pick<
  T,
  {
    [Key in keyof T]: T[Key] extends Function ? never : Key;
  }[keyof T]
>;

export type MappingConfig<I extends Base, D extends Object> = {
  [K in keyof WithoutFunctions<I>]?: Mapping<I, D, I[K]>;
};

export function isMappedCreateArgs(
  args: CreateArgs<Base, Object>
): args is MappedCreateArgs<Base, Object> {
  return !!args && "mapping" in args;
}

export type CreateArgs<I extends Base, D> =
  | SimpleCreateArgs<I>
  | MappedCreateArgs<I, D>;

export interface SimpleCreateArgs<I extends Base> {
  data: Partial<WithoutFunctions<I>>;
}

export interface MappedCreateArgs<I extends Base, D extends Object> {
  data: D;
  mapping: MappingConfig<I, D>;
}

export type Mapping<I extends Base, D extends Object, V> =
  | string
  | ((val: Optional<unknown>, args: {instance: I; data: D}) => V);
