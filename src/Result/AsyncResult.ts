import {Result, Fail, Success} from "./Result";

export class AsyncResult<T, F extends Error>
  implements PromiseLike<Result<T, F>>
{
  protected constructor(protected promise: Promise<Result<T, F>>) {}

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

  async mergeFailure(mapFailure: (failure: F) => T): Promise<T> {
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
