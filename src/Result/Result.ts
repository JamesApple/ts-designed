import {AsyncResult} from "./AsyncResult";
import {Optional} from "../Optional";

export abstract class Result<T, F extends Error = Error> {
  static fromThrowable<T, F extends Error>(throwable: () => T): Result<T, F> {
    try {
      return Success.of(throwable()) as any;
    } catch (e) {
      return Fail.of<F>(e) as any;
    }
  }

  static fromPromise<T, F extends Error = Error>(
    promise: Promise<T>
  ): AsyncResult<T, F> {
    return AsyncResult.fromPromise<T, F>(promise);
  }

  static success<T, F extends Error = Error>(value: T): Result<T, F> {
    return Success.of<T>(value) as any;
  }

  static fail<F extends Error = Error, T = unknown>(value: F): Result<T, F> {
    return Fail.of<F>(value) as any;
  }

  abstract mapAsync<X, Y extends Error = F>(
    mapSuccess: (success: T) => Promise<X>,
    mapError?: (error: F) => Promise<Y>
  ): AsyncResult<X, Y>;

  abstract tap(
    tapSuccess: (success: T) => unknown,
    tapError?: (error: F) => unknown
  ): Result<T, F>;

  abstract tapAsync(
    tapSuccess: (success: T) => Promise<unknown>,
    tapError?: (error: F) => Promise<unknown>
  ): AsyncResult<T, F>;

  abstract map<X, Y extends Error = F>(
    mapSuccess: (success: T) => X,
    mapError?: (error: F) => Y
  ): Result<X, Y>;

  abstract mergeFailure(mapFailure: (failure: F) => T): T;

  abstract mapFailure<X extends Error>(
    mapFailure: (failed: F) => X
  ): Result<T, X>;

  abstract recover<R>(recover: (failed: F) => R): Success<T | R>;

  abstract isSuccess(): this is Success<T>;

  abstract isFailure(): this is Fail<F>;

  abstract getOrThrowFailure(): T;

  abstract getEither(): T | F;

  abstract toOptionalFailure(): Optional<F>;

  abstract toOptional(): Optional<T>;
}

export class Fail<E extends Error> extends Result<unknown, E> {
  static of<E extends Error>(value: E): Fail<E> {
    return new Fail(value);
  }

  protected constructor(private value: E) {
    super();
  }

  mergeFailure<T>(mapFailure: (failure: E) => T): T {
    return mapFailure(this.value);
  }

  get(): E {
    return this.value;
  }

  map<X, Y extends Error = E>(
    _: (success: unknown) => X,
    mapError?: (error: E) => Y
  ): Result<X, Y> {
    try {
      return mapError
        ? new Fail(mapError(this.value))
        : (new Fail(this.value) as any);
    } catch (e) {
      return new Fail(e) as any;
    }
  }

  tap(
    _: (success: unknown) => unknown,
    mapError?: (error: E) => unknown
  ): Result<unknown, E> {
    return this.map(
      (v) => v,
      (e) => {
        if (mapError) {
          mapError(e);
        }
        return e;
      }
    );
  }

  mapAsync<X, Y extends Error = E>(
    _: (success: unknown) => Promise<X>,
    mapError?: (error: E) => Promise<Y>
  ): AsyncResult<X, Y> {
    if (mapError) {
      return AsyncResult.unwrapResult(
        Promise.resolve(mapError(this.value)).then((err) => Fail.of(err))
      ) as any;
    } else {
      return AsyncResult.unwrapResult(Promise.resolve(this) as any);
    }
  }

  tapAsync(
    _: (success: unknown) => Promise<unknown>,
    tapError?: (error: E) => Promise<unknown>
  ): AsyncResult<unknown, E> {
    if (tapError) {
      return AsyncResult.unwrapResult(
        tapError(this.value).then(() => Fail.of(this.value))
      );
    } else {
      return AsyncResult.unwrapResult(Promise.resolve(this));
    }
  }

  mapFailure<X extends Error>(
    mapFailure: (failed: E) => X
  ): Result<unknown, X> {
    return this.map((i) => i, mapFailure);
  }

  recover<R>(recover: (failed: E) => R): Success<unknown> {
    return Success.of(recover(this.value));
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

  toOptionalFailure(): Optional<E> {
    return Optional.of(this.value);
  }

  toOptional(): Optional<unknown> {
    return Optional.empty();
  }
}

export class Success<T> extends Result<T, Error> {
  protected constructor(private value: T) {
    super();
  }

  static of<E>(value: E): Success<E> {
    return new Success(value);
  }

  mergeFailure(): T {
    return this.value;
  }

  recover(): Success<T> {
    return this;
  }

  get(): T {
    return this.value;
  }

  tap(mapSuccess: (success: T) => unknown): Result<T, Error> {
    return this.map((v) => {
      if (mapSuccess) {
        mapSuccess(v);
      }
      return v;
    });
  }

  tapAsync(
    tapSuccess: (success: T) => Promise<unknown>
  ): AsyncResult<T, Error> {
    return AsyncResult.fromPromise(
      tapSuccess(this.value).then(() => this.value)
    );
  }

  map<X, Y extends Error = Error>(mapSuccess: (success: T) => X): Result<X, Y> {
    try {
      return new Success(mapSuccess(this.value)) as any;
    } catch (e) {
      return Result.fail(e) as any;
    }
  }

  mapAsync<X, Y extends Error = Error>(
    mapSuccess: (success: T) => Promise<X>
  ): AsyncResult<X, Y> {
    return AsyncResult.fromPromise(mapSuccess(this.value));
  }

  mapFailure<X extends Error>(): Result<T, X> {
    return this as any;
  }

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Fail<Error> {
    return false;
  }

  getOrThrowFailure(): T {
    return this.value;
  }

  getEither(): T {
    return this.value;
  }

  toOptionalFailure(): Optional<Error> {
    return Optional.empty();
  }

  toOptional(): Optional<T> {
    return Optional.of(this.value);
  }
}
