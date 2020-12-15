import {Optional} from "./Optional";

export type AsyncOptionalOf<T> = AsyncOptional<NonNullable<T>>;

export abstract class AsyncOptional<T>
  implements PromiseLike<Optional<NonNullable<T>>> {
  static of<T>(promise: Promise<T>): AsyncOptionalOf<T> {
    return PresentAsyncOptional.fromPromise(promise);
  }

  static empty<T>(): AsyncOptionalOf<T> {
    return new AbsentAsyncOptional();
  }

  abstract then<TResult1 = Optional<NonNullable<T>>, TResult2 = never>(
    onfulfilled?:
      | ((value: Optional<NonNullable<T>>) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2>;

  abstract map<X>(transform: (value: T) => X): AsyncOptional<X>;

  abstract mapAsync<X>(transform: (value: T) => Promise<X>): AsyncOptionalOf<X>;

  abstract flatMapAsync<X>(
    transform: (value: T) => Promise<Optional<X>> | AsyncOptional<X>
  ): AsyncOptionalOf<X>;

  abstract flatMap<X>(transform: (value: T) => Optional<X>): AsyncOptional<X>;

  abstract filter(predicate: (value: T) => boolean): AsyncOptional<T>;

  abstract orElse<X>(value: X): Promise<X | T>;

  abstract orGet<X>(supplier: () => X): Promise<T | X>;

  abstract orThrow(errThrower: () => Error): Promise<T>;

  abstract get(): Promise<T>;

  abstract toJSON(_: string): Promise<T | null>;

  abstract asJSON(_: string): Promise<T | null>;
}

export class AbsentAsyncOptional<T> extends AsyncOptional<T> {
  flatMapAsync<X>(): AsyncOptional<X> {
    return new AbsentAsyncOptional();
  }

  mapAsync<X>(): AsyncOptionalOf<X> {
    return new AbsentAsyncOptional();
  }

  filter(): AsyncOptional<T> {
    return new AbsentAsyncOptional();
  }

  flatMap<X>(transform: (value: T) => Optional<X>): AbsentAsyncOptional<X> {
    return new AbsentAsyncOptional();
  }

  toJSON(_: string): Promise<T | null> {
    return Promise.resolve(null);
  }

  asJSON(_: string): Promise<T | null> {
    return Promise.resolve(null);
  }

  get(): Promise<T> {
    return Promise.reject(
      new TypeError("AsyncOptional.get() was called but no value was provided")
    );
  }

  orThrow(errThrower: () => Error): Promise<T> {
    return Promise.resolve<T>(null!).then(() => {
      const err = errThrower();
      if (err instanceof Error) {
        throw err;
      }
      throw new TypeError(
        "AsyncOptional.orThrow did not return an error to throw"
      );
    });
  }

  orGet<X>(supplier: () => X): Promise<T | X> {
    return Promise.resolve(supplier());
  }

  orElse<X>(value: X): Promise<T | X> {
    return Promise.resolve(value);
  }

  map<X>(): AsyncOptional<X> {
    return new AbsentAsyncOptional();
  }

  then<TResult1 = Optional<NonNullable<T>>, TResult2 = never>(
    onfulfilled?:
      | ((value: Optional<NonNullable<T>>) => TResult1 | PromiseLike<TResult1>)
      | null
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(Optional.empty() as any).then(
      onfulfilled ? onfulfilled : (x) => x
    );
  }
}

export class PresentAsyncOptional<T> extends AsyncOptional<T> {
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
          return v;
        }
        return transform(v);
      })
    );
  }

  filter(predicate: (value: T) => boolean): AsyncOptional<T> {
    return PresentAsyncOptional.fromPromise(
      this.value.then((v: any) => {
        if (v == null) {
          return new AbsentAsyncOptional();
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
          return new AbsentAsyncOptional();
        }
        return transform(v).orElse(null!) as any;
      })
    );
  }

  toJSON(_: string): Promise<T | null> {
    return this.value.then((v) => (v == null ? null : v));
  }

  asJSON(_: string): Promise<T | null> {
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
    return PresentAsyncOptional.fromPromise(this.value.then(transform)) as any;
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
