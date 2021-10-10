export type WithoutFunctions<T> = Pick<
  T,
  {
    [Key in keyof T]: T[Key] extends Function ? never : Key;
  }[keyof T]
>;

export type Require<T> = Exclude<T, null | undefined>;

export type ValueObjectClass = {
  new (...args: any): ValueObjectInstance;
  fromJSON(...args: any): any;
};
export type ValueObjectInstance = {asJSON(...args: any): any};



/**
 * Quick steal from https://dev.to/lucianbc/union-type-merging-in-typescript-9al
 */
type CommonKeys<T extends object> = keyof T;
type AllKeys<T> = T extends any ? keyof T : never;
type Subtract<A, C> = A extends C ? never : A;
type NonCommonKeys<T extends object> = Subtract<AllKeys<T>, CommonKeys<T>>;
type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
  ? T[K]
  : undefined;
type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T>
  ? PickType<T, K>
  : never;

export type MergeUnion<T extends object> = {
  [k in CommonKeys<T>]: PickTypeOf<T, k>;
} &
  {
    [k in NonCommonKeys<T>]?: PickTypeOf<T, k>;
  };
