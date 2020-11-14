import {Optional} from "./Optional";

export abstract class Result<T, F> {
  static fromThrowable<T, F = unknown>(throwable: () => T): Result<T, F> {
    try {
      return Success.of(throwable()) as any;
    } catch (e) {
      return Fail.of<F>(e) as any;
    }
  }

  static async fromPromise<T, F = unknown>(
    promise: Promise<T>
  ): Promise<Result<T, F>> {
    try {
      return Success.of(await promise) as any;
    } catch (e) {
      return Fail.of(e) as any;
    }
  }

  static success<T, F = unknown>(value: T): Result<T, F> {
    return Success.of<T>(value) as any;
  }

  static fail<F, T = unknown>(value: F): Result<T, F> {
    return Fail.of<F>(value) as any;
  }

  abstract map<X, Y = F>(
    mapSuccess: (success: T) => X,
    mapError?: (error: F) => Y
  ): Result<X, Y>;

  abstract mapFailure<X>(mapFailure: (failed: F) => X): Result<T, X>;

  abstract isSuccess(): this is Success<T>;

  abstract isFailure(): this is Fail<F>;

  abstract getOrThrowFailure(): T;

  abstract getEither(): T | F;

  abstract swap(): Result<F, T>;

  abstract toOptionalFailure(): Optional<F>;

  abstract toOptional(): Optional<T>;
}

export class Fail<E> extends Result<unknown, E> {
  static of<E>(value: E) {
    return new Fail(value);
  }

  protected constructor(private value: E) {
    super();
  }

  map<X, Y = E>(
    _: (success: unknown) => X,
    mapError?: (error: E) => Y
  ): Result<X, Y> {
    return mapError
      ? new Fail(mapError(this.value))
      : (new Fail(this.value) as any);
  }

  mapFailure<X>(mapFailure: (failed: E) => X): Result<unknown, X> {
    return new Fail(mapFailure(this.value));
  }

  isSuccess(): this is Success<unknown> {
    return false;
  }

  isFailure(): this is Fail<E> {
    return true;
  }

  getOrThrowFailure(): unknown {
    if (this.value instanceof Error) {
      throw this.value;
    } else {
      throw new TypeError(`Result threw a non error type: ${this.value}`);
    }
  }

  getEither(): E {
    return this.value;
  }

  swap(): Result<E, unknown> {
    return Success.of(this.value);
  }

  toOptionalFailure(): Optional<E> {
    return Optional.of(this.value);
  }

  toOptional(): Optional<unknown> {
    return Optional.empty();
  }
}

export class Success<T> extends Result<T, unknown> {
  protected constructor(private value: T) {
    super();
  }

  static of<E>(value: E) {
    return new Success(value);
  }

  map<X, Y = unknown>(mapSuccess: (success: T) => X): Result<X, Y> {
    return new Success(mapSuccess(this.value)) as any;
  }

  mapFailure<X>(): Result<T, X> {
    return this as any;
  }

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Fail<unknown> {
    return false;
  }

  getOrThrowFailure(): T {
    return this.value;
  }

  getEither(): T {
    return this.value;
  }

  swap(): Result<unknown, T> {
    return Fail.of(this.value);
  }

  toOptionalFailure(): Optional<unknown> {
    return Optional.empty();
  }

  toOptional(): Optional<T> {
    return Optional.of(this.value);
  }
}