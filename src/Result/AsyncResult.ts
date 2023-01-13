import {DomainError} from "../DomainError";
import {AsyncOptional, Optional} from "../Optional";
import {Result, Fail, Success} from "./Result";

export class ResultTimeout extends DomainError {
  message = "Exceeded Timeout";
}

export class AsyncResult<T, F extends Error = Error>
  implements PromiseLike<Result<T, F>>
{
  protected constructor(protected promise: Promise<Result<T, F>>) {}

  /**
   * Wraps a potentially unsafe function and makes it return a result type
   */
  static wrap<FN extends (...args: any[]) => any>(fn: FN) {
    return (
      ...args: Parameters<FN>
    ): FN extends (...args: any[]) => infer RT ? AsyncResult<RT> : never => {
      return AsyncResult.fromPromise((async () => fn(...args))()) as any;
    };
  }

  /**
   * Create a result by immediately invoking the passed callback
   */
  static invoke = <T>(fn: () => Promise<T> | T) => {
    return AsyncResult.fromPromise((async () => fn())());
  };

  then<TResult1 = Result<T, F>, TResult2 = never>(
    onfulfilled?:
      | ((value: Result<T, F>) => TResult1 | PromiseLike<TResult1>)
      | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, (err) => {
      const fail = Fail.of<F>(err);
      if (onfulfilled) {
        onfulfilled(fail as any);
      }
      return fail as any;
    });
  }

  static fail<T = unknown, F extends Error = Error>(
    error: F
  ): AsyncResult<T, F> {
    return AsyncResult.fromPromise(Promise.reject(error));
  }

  static success<T, F extends Error = Error>(value: T): AsyncResult<T, F> {
    return AsyncResult.fromPromise(Promise.resolve(value));
  }

  static fromPromise<T, F extends Error = Error>(
    promise: Promise<T>
  ): AsyncResult<T, F> {
    return new AsyncResult(promise.then(Success.of).catch(Fail.of) as any);
  }

  static unwrapResult<T, F extends Error = Error>(
    promise: Promise<Result<T, F>>
  ): AsyncResult<T, F> {
    return new AsyncResult(promise);
  }

  withTimeout<E extends Error = ResultTimeout>(
    ms: number,
    error?: E
  ): AsyncResult<T, F | E> {
    return AsyncResult.fromPromise(
      (async () => {
        let timeoutMarker: any;
        const timeout = new Promise((_, rej) => {
          timeoutMarker = setTimeout(
            () =>
              rej(
                error ??
                  new ResultTimeout(`Timeout of ${ms} milliseconds exceeded`)
              ),
            ms
          );
        });
        await Promise.race([this, timeout]);
        clearTimeout(timeoutMarker);
        return this.getOrThrowFailure();
      })()
    );
  }

  async getOrThrowFailure(): Promise<T> {
    return (await this).getOrThrowFailure();
  }

  async getEither(): Promise<T | F> {
    return (await this).getEither();
  }

  tap(
    mapSuccess: (success: T) => unknown,
    mapError?: (error: F) => unknown
  ): AsyncResult<T, F> {
    return new AsyncResult(
      this.then((result) => result.tap(mapSuccess, mapError))
    );
  }

  tapAsync(
    mapSuccess: (success: T) => Promise<unknown>,
    mapError?: (error: F) => Promise<unknown>
  ): AsyncResult<T, F> {
    return new AsyncResult(
      this.then((result) => result.tapAsync(mapSuccess, mapError))
    );
  }

  map<X, Y extends Error = F>(
    mapSuccess: (success: T) => X,
    mapError?: (error: F) => Y
  ): AsyncResult<X, Y> {
    return new AsyncResult(
      this.then((result) => result.map(mapSuccess, mapError))
    );
  }

  mapAsync<X, Y extends Error = F>(
    mapSuccess: (success: T) => Promise<X>,
    mapError?: (error: F) => Promise<Y>
  ): AsyncResult<X, Y> {
    return new AsyncResult(
      this.then((result) => result.mapAsync(mapSuccess, mapError))
    );
  }

  flatMap<X, XF extends Error = F>(
    mapSuccess: (success: T) => Result<X>,
    mapError?: (error: F) => Result<XF>
  ): AsyncResult<X, XF | F> {
    return AsyncResult.unwrapResult(
      this.then(async (result) => result.flatMap(mapSuccess, mapError))
    );
  }

  flatMapAsync<X, XF extends Error = F>(
    mapSuccess: (success: T) => AsyncResult<X>,
    mapError?: (error: F) => AsyncResult<XF>
  ): AsyncResult<X, XF | F> {
    return AsyncResult.unwrapResult(
      this.then(async (result) => result.flatMapAsync(mapSuccess, mapError))
    );
  }

  toOptionalFailure(): AsyncOptional<F> {
    return Optional.of(true).flatMapAsync(() =>
      this.then((result) => result.toOptionalFailure())
    );
  }

  toOptional(): AsyncOptional<T> {
    return Optional.of(true).flatMapAsync(() =>
      this.then((result) => result.toOptional())
    );
  }

  async mergeFailure<R>(mapFailure: (failure: F) => R): Promise<T | R> {
    return this.then((r) => r.mergeFailure(mapFailure));
  }

  mapFailure<X extends Error = F>(
    mapFailure: (failed: F) => X
  ): AsyncResult<T, X> {
    return new AsyncResult(
      this.then((result) => result.mapFailure(mapFailure))
    );
  }
}
