import {Base} from "./Base";

export class EntityInitializationError extends Error {}

export type WithoutFunctions<T> = Pick<
  T,
  {
    [Key in keyof T]: T[Key] extends Function ? never : Key;
  }[keyof T]
>;

export type CreateArgs<I extends Base> = SimpleCreateArgs<I>;

export type SimpleCreateArgs<I extends Base> = Partial<I>;
