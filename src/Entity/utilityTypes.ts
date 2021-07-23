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
