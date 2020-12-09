export type WithoutFunctions<T> = Pick<
  T,
  {
    [Key in keyof T]: T[Key] extends Function ? never : Key;
  }[keyof T]
>;
