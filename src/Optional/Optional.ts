import {AsyncOptional, PresentAsyncOptional} from "./AsyncOptional";

export type OptionalizeArray<T extends [...any[]]> = {
  [Index in keyof T]: Optional<NonNullable<T[Index]>>;
} &
  Array<any>;

export class OptionalValueMissingError extends Error {}

export type OptionalValue<T> = T extends Optional<infer U>
  ? U
  : T extends AsyncOptional<infer U>
  ? U
  : T extends Promise<Optional<infer U>>
  ? U
  : never;

export type OptionalValuesFromTuple<T extends [...any[]]> = {
  [Index in keyof T]: OptionalValue<T[Index]>;
} & {length: T["length"]};

export abstract class Optional<T> {
  /**
   * @example
   * Create an optional from a nullable value. This will remove the types null
   * or undefined using `value != null`.
   *
   * ```ts
   * Optional.of('Hello') // Optional<string>
   * Optional.of<string>(null) // Optional<string>
   * ```
   */
  static of = <T>(
    value: T | Optional<NonNullable<T>>
  ): Optional<NonNullable<T>> => {
    if (value instanceof Optional) return value;
    return value == null
      ? new AbsentOptional<NonNullable<T>>()
      : new PresentOptional<NonNullable<T>>(value as any);
  };

  /**
   *
   * @remark
   * Used for compatibility with other parts of this library that utilize
   * fromJSON/asJSON/toJSON to manage serialization. This is logically the same as `Optional.of`
   *
   * @example
   * ```ts
   * Optional.fromJSON(null)
   * Optional.fromJSON('Hello')
   * ```
   */
  static fromJSON = <T = any>(data: T): Optional<T> => Optional.of(data);

  /**
   * @remark
   * Create an empty optional to model a failure case
   */
  static empty = <T = unknown>(): Optional<T> => {
    return new AbsentOptional();
  };

  /**
   * @example
   *
   * Used in an if statement, will guarantee the type of the optional as either present or absent
   *```ts
   *if (maybeUser.isPresent()) {
   *  maybeUser; // Instance of PresentOptional<User>
   *}
   *```
   */
  abstract isPresent(): this is PresentOptional<T>;

  /**
   * @example
   *
   * Used in an if statement, will guarantee the type of the optional as either present or absent
   *```ts
   *if (maybeUser.isAbsent()) {
   *  maybeUser; // Instance of AbsentOptional<User>
   *}
   * ```
   */
  abstract isAbsent(): this is AbsentOptional<T>;

  /**
   * @example
   * Will remove a value that does not satisfy the predicate.
   *
   * ```ts
   * Optional.of(5).filter(n => n > 5) // AbsentOptional<number>
   * Optional.of(5).filter(n => n === 5) // PresentOptional<number>
   * ```
   */
  abstract filter<X extends T>(
    predicate: (value: T) => value is X
  ): Optional<X>;
  abstract filter(predicate: (value: T) => boolean): Optional<T>;

  abstract filterNot<X extends T>(
    predicate: (value: T) => value is X
  ): Optional<Exclude<T, X>>;
  abstract filterNot(predicate: (value: T) => boolean): Optional<T>;

  /**
   * @remark
   * Apply a transform to the value of the optional and return a new optional
   * of the result. This will not allow the return value to be nullable.
   *
   * @example
   *
   * ```ts
   * Optional.of('Hello').map(s => s.toUpperCase()) // Optional<"HELLO">
   * Optional.of(null).map(s => s.toUpperCase())    // AbsentOptional<string>
   * ```
   */
  abstract map<X>(transform: (value: T) => X): Optional<NonNullable<X>>;
  abstract mapAsync<X>(
    transform: (value: T) => Promise<X>
  ): AsyncOptional<NonNullable<X>>;

  /**
   * @remark
   * Apply a transform to the value of the optional and return a new optional
   * of its value. This means you can take a function that returns another
   * function and it will "collapse" the optional
   *
   * @example
   *
   * ```ts
   * Optional.of('Hello').map(s => s.toUpperCase()) // Optional<"HELLO">
   * Optional.of(null).map(s => s.toUpperCase())    // AbsentOptional<string>
   * ```
   */
  abstract flatMap<X>(transform: (value: T) => Optional<X>): Optional<X>;
  abstract flatMapAsync<X>(
    transform: (value: T) => AsyncOptional<X> | Promise<Optional<X>>
  ): AsyncOptional<X>;

  abstract zip<X extends Optional<any>[]>(
    ...others: X
  ): Optional<OptionalValuesFromTuple<[Optional<T>, ...X]>>;
  abstract unzip<V extends Optional<[any, any]>>(
    this: V
  ): OptionalizeArray<OptionalValue<V>>;
  abstract unzip3<V extends Optional<[any, any, any]>>(
    this: V
  ): OptionalizeArray<OptionalValue<V>>;

  /**
   * @example
   *
   * ```ts
   * Optional.of(5).orElse('not there') // 5 (typeof string | number)
   * Optional.empty().orElse('not there') // 'not there' (typeof string | number)
   * ```
   */
  abstract orElse<X>(other: X): T | X;

  /**
   * @example
   * Use a getter function to return a new value
   *
   * ```ts
   * Optional.of(5).orGet(() => 'not there') // 5 (typeof string | number)
   * ```
   */
  abstract orGet<X>(supplier: () => X): T | X;

  /**
   * @remark
   * This _must_ throw an exception when the method is invoked or the optional
   * itself will throw a `TypeError`.
   * @example
   * ```ts
   * Optional.of(5).orThrow(() => { throw new Error('I am thrown'); })
   * Optional.of(5).orThrow(() => new Error('I am thrown'))
   * ```
   */
  abstract orThrow(errThrower: () => Error): T;

  /**
   * @example
   * ```ts
   * Optional.of(5).get() // 5
   * Optional.of(5).get() // throw TypeError
   * ```
   */
  abstract get(): T;

  /**
   * @remark
   * Used with other libraries to allow serialization to JSON without coercing to a string
   */
  abstract toJSON(_: string): T | null;

  abstract toArray(): T[];

  /**
   * Serialize a value using designed's preferred #asJSON method
   */
  abstract asJSON(): T | null;
}

export class PresentOptional<T> extends Optional<T> {
  toArray(): [T] {
    return [this.value];
  }


  unzip<V extends Optional<[any, any]>>(
    this: V
  ): OptionalizeArray<OptionalValue<V>> {
    const [a, b] = this.get();
    return [Optional.of(a), Optional.of(b)] as any;
  }

  unzip3<V extends Optional<[any, any, any]>>(
    this: V
  ): OptionalizeArray<OptionalValue<V>> {
    const [a, b, c] = this.get();
    return [Optional.of(a), Optional.of(b), Optional.of(c)] as any;
  }

  zip<X extends Optional<any>[]>(
    ...others: X
  ): Optional<OptionalValuesFromTuple<[Optional<T>, ...X]>> {
    const result = [this.value];
    for (let i = 0; i < others.length; i++) {
      if (others[i].isPresent()) {
        result.push(others[i].get());
      } else {
        return Optional.empty();
      }
    }
    return Optional.of(result as any);
  }

  filter(predicate: (value: T) => boolean): Optional<T> {
    return predicate(this.value)
      ? new PresentOptional(this.value)
      : new AbsentOptional<T>();
  }

  filterNot<X extends T>(
    predicate: (value: T) => value is X
  ): Optional<Exclude<T, X>>;
  filterNot(predicate: (value: T) => boolean): Optional<T> {
    return this.filter((v) => !predicate(v));
  }

  constructor(private value: T) {
    super();
  }

  map<X>(transform: (value: T) => X): Optional<NonNullable<X>> {
    return Optional.of(transform(this.value));
  }

  mapAsync<X>(
    transform: (value: T) => Promise<X>
  ): AsyncOptional<NonNullable<X>> {
    return PresentAsyncOptional.fromPromise(transform(this.value));
  }

  flatMap<X>(transform: (value: T) => Optional<X>): Optional<X> {
    return transform(this.value);
  }

  flatMapAsync<X>(
    transform: (value: T) => AsyncOptional<X> | Promise<Optional<X>>
  ): AsyncOptional<X> {
    return PresentAsyncOptional.fromPromise(
      (transform(this.value) as any).then((v: any) => v.orElse(null))
    );
  }

  orElse(): T {
    return this.value;
  }

  orGet(): T {
    return this.value;
  }

  orThrow(): T {
    return this.value;
  }

  toJSON(): T | null {
    return this.value;
  }

  asJSON(): T | null {
    return this.value;
  }

  isPresent(): this is PresentOptional<T> {
    return true;
  }

  isAbsent(): this is AbsentOptional<T> {
    return false;
  }

  get(): T {
    return this.value;
  }
}

export class AbsentOptional<T> extends Optional<T> {
  toArray(): T[] {
    return [];
  }

  unzip<V extends Optional<[any, any]>>(
    this: V
  ): OptionalizeArray<OptionalValue<V>> {
    return [Optional.empty(), Optional.empty()] as any;
  }

  unzip3<V extends Optional<[any, any, any]>>(
    this: V
  ): OptionalizeArray<OptionalValue<V>> {
    return [Optional.empty(), Optional.empty(), Optional.empty()] as any;
  }

  zip<X extends Optional<any>[]>(): Optional<
    OptionalValuesFromTuple<[Optional<T>, ...X]>
  > {
    return new AbsentOptional();
  }

  constructor() {
    super();
  }

  map<X>(): Optional<X> {
    return new AbsentOptional<X>();
  }

  mapAsync<X>(): AsyncOptional<NonNullable<X>> {
    return AsyncOptional.empty();
  }

  filter(): Optional<T> {
    return new AbsentOptional();
  }

  filterNot<X extends T>(
    predicate: (value: T) => value is X
  ): Optional<Exclude<T, X>>;
  filterNot(): Optional<T> {
    return new AbsentOptional();
  }

  flatMap<X>(): Optional<X> {
    return new AbsentOptional();
  }

  flatMapAsync<X>(): AsyncOptional<X> {
    return AsyncOptional.empty();
  }

  orElse<X>(other: X): T | X {
    return other;
  }

  orGet<X>(supplier: () => X): T | X {
    return supplier();
  }

  orThrow(errThrower: () => Error): T {
    const err = errThrower();
    if (err instanceof Error) {
      throw err;
    } else {
      throw TypeError(
        "Optional.orThrow callback did not throw or return an error"
      );
    }
  }

  toJSON(): T | null {
    return null;
  }

  asJSON(): T | null {
    return null;
  }

  isPresent(): this is PresentOptional<T> {
    return false;
  }

  isAbsent(): this is AbsentOptional<T> {
    return true;
  }

  get(): T {
    throw new OptionalValueMissingError(
      ".get() was called on an optional that had no value. Add a check before unwrapping."
    );
  }
}
