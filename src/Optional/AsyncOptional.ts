import {
  Optional,
  OptionalizeArray,
  OptionalValue,
  OptionalValuesFromTuple
} from "./Optional";

export type AsyncOptionalOf<T> = AsyncOptional<NonNullable<T>>;

type AnyOptional<T> = Optional<T> | Promise<Optional<T>> | AsyncOptional<T>;

export abstract class AsyncOptional<T>
  implements PromiseLike<Optional<NonNullable<T>>> {
  static of<T>(promise: Promise<T>): AsyncOptionalOf<T> {
    return PresentAsyncOptional.fromPromise(promise);
  }

  static empty<T>(): AsyncOptionalOf<T> {
    return PresentAsyncOptional.fromPromise(Promise.resolve(undefined));
  }

  abstract then<TResult1 = Optional<NonNullable<T>>, TResult2 = never>(
    onfulfilled?:
      | ((value: Optional<NonNullable<T>>) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2>;

  abstract map<X>(transform: (value: T) => X): AsyncOptional<X>;

  abstract mapAsync<X>(transform: (value: T) => Promise<X>): AsyncOptionalOf<X>;

  instanceOf<C extends (new (...args: any[]) => any)[]>(...klasses: C): AsyncOptional<InstanceType<C[number]>> {
    return this.filter(( value ) => !!klasses.find(klass => value instanceof klass) ) as any
  }

  tap(view: (value: T) => unknown): AsyncOptional<T> {
    return this.map((value) => { 
      view(value)
      return value
    })
  }

  tapAsync( view: (value: T) => Promise<unknown>): AsyncOptional<T> {
    return this.mapAsync(async (value) => { 
      await view(value)
      return value
    })
  }

  abstract zip<X extends AnyOptional<any>[]>(
    ...others: X
  ): AsyncOptional<OptionalValuesFromTuple<[Optional<T>, ...X]>>;
  abstract unzip<V extends AsyncOptional<[any, any]>>(
    this: V
  ): Promise<OptionalizeArray<OptionalValue<V>>>;
  abstract unzip3<V extends AsyncOptional<[any, any, any]>>(
    this: V
  ): Promise<OptionalizeArray<OptionalValue<V>>>;

  abstract flatMap<X>(transform: (value: T) => Optional<X>): AsyncOptional<X>;
  abstract flatMapAsync<X>(
    transform: (value: T) => Promise<Optional<X>> | AsyncOptional<X>
  ): AsyncOptionalOf<X>;

  abstract filter<X extends T>(
    predicate: (value: T) => value is X
  ): AsyncOptional<X>;
  abstract filter(predicate: (value: T) => boolean): AsyncOptional<T>;

  abstract filterNot<X extends T>(
    predicate: (value: T) => value is X
  ): AsyncOptional<Exclude<T, X>>;
  abstract filterNot(predicate: (value: T) => boolean): AsyncOptional<T>;

  abstract orElse<X>(value: X): Promise<X | T>;

  abstract orGet<X>(supplier: () => X): Promise<T | X>;

  abstract orThrow(errThrower: () => Error): Promise<T>;

  abstract get(): Promise<T>;

  abstract toJSON(_: string): Promise<T | null>;

  abstract toArray(): Promise<T[]>;

  abstract asJSON(_: string): Promise<T | null>;
}

export class PresentAsyncOptional<T> extends AsyncOptional<T> {
  unzip<V extends AsyncOptional<[any, any]>>(
    this: V
  ): Promise<OptionalizeArray<OptionalValue<V>>> {
    return this.orElse(null).then((v) => {
      if (v == null) {
        return [Optional.empty(), Optional.empty()] as any;
      } else {
        return [Optional.of(v[0]), Optional.of(v[1])] as any;
      }
    });
  }
  unzip3<V extends AsyncOptional<[any, any, any]>>(
    this: V
  ): Promise<OptionalizeArray<OptionalValue<V>>> {
    return this.orElse(null).then((v) => {
      if (v == null) {
        return [Optional.empty(), Optional.empty(), Optional.empty()] as any;
      } else {
        return [Optional.of(v[0]), Optional.of(v[1]), Optional.of(v[2])] as any;
      }
    });
  }

  filterNot<X extends T>(
    predicate: (value: T) => value is X
  ): AsyncOptional<Exclude<T, X>>;
  filterNot(predicate: (value: T) => boolean): AsyncOptional<T> {
    return PresentAsyncOptional.fromPromise(
      this.value.then((v: any) => {
        if (v == null) {
          return null;
        }
        return predicate(v) ? null : v;
      })
    ) as any;
  }

  toArray(): Promise<T[]> {
    return this.value.then((v) => {
      if (v == null) {
        return [];
      } else {
        return [v];
      }
    });
  }
  zip<X extends AnyOptional<any>[]>(
    ...others: X
  ): AsyncOptional<OptionalValuesFromTuple<[Optional<T>, ...X]>> {
    return PresentAsyncOptional.fromPromise(
      Promise.all([this, ...others]).then(([main, ...rest]) => {
        return main.zip(...rest).orElse(null) as any;
      })
    );
  }

  flatMapAsync<X>(
    transform: (value: T) => Promise<Optional<X>> | AsyncOptional<X>
  ): AsyncOptionalOf<X> {
    return PresentAsyncOptional.fromPromise(
      this.value.then((v: any) => {
        if (v == null) {
          return null;
        }
        return (transform(v) as any).then((opt: any) => opt.orElse(null));
      })
    );
  }

  mapAsync<X>(transform: (value: T) => Promise<X>): AsyncOptionalOf<X> {
    return PresentAsyncOptional.fromPromise(
      this.value.then((v: any) => {
        if (v == null) {
          return null;
        }
        return transform(v);
      })
    );
  }

  filter(predicate: (value: T) => boolean): AsyncOptional<T> {
    return PresentAsyncOptional.fromPromise(
      this.value.then((v: any) => {
        if (v == null) {
          return null;
        }
        return predicate(v) ? v : null;
      })
    );
  }

  constructor(private value: Promise<T>) {
    super();
  }

  flatMap<X>(transform: (value: T) => Optional<X>): AsyncOptional<X> {
    return PresentAsyncOptional.fromPromise(
      this.value.then((v) => {
        if (v == null) {
          return null;
        }
        return transform(v).orElse(null!) as any;
      })
    );
  }

  toJSON(): Promise<T | null> {
    return this.value.then((v) => (v == null ? null : v));
  }

  asJSON(): Promise<T | null> {
    return this.value.then((v) => (v == null ? null : v));
  }

  get(): Promise<T> {
    return this.value.then((v) => {
      if (v == null) {
        throw new TypeError(
          "AsyncOptional.get() was called but no value was provided"
        );
      }
      return v;
    });
  }

  orThrow(errThrower: () => Error): Promise<T> {
    return this.value.then((val) => {
      if (val == null) {
        const err = errThrower();
        if (err instanceof Error) {
          throw err;
        }
        throw new TypeError(
          "AsyncOptional.orThrow did not return an error to throw"
        );
      } else {
        return val;
      }
    });
  }

  orGet<X>(supplier: () => X): Promise<T | X> {
    return this.value.then((v) => (v == null ? supplier() : v));
  }

  orElse<X>(value: X): Promise<T | X> {
    return this.value.then((v) => (v == null ? value : v));
  }

  static fromPromise<T>(promise: Promise<T>): AsyncOptionalOf<T> {
    return new PresentAsyncOptional(promise) as any;
  }

  map<X>(transform: (value: T) => X): AsyncOptional<X> {
    return PresentAsyncOptional.fromPromise(
      this.value.then((v) => {
        if (v == null) {
          return null;
        }
        return transform(v);
      })
    ) as any;
  }

  then<TResult1 = Optional<NonNullable<T>>, TResult2 = never>(
    onfulfilled?:
      | ((value: Optional<NonNullable<T>>) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.value
      .then((v) => Optional.of(v))
      .then(
        (onfulfilled ? onfulfilled : (x: any) => x) as any,
        onrejected ? onrejected : undefined
      );
  }
}
