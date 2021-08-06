import {AsyncResult, Fail, Result, ResultTimeout} from "../Result";

const value = "Value";
const error = new Error("Error");

describe("Result", () => {
  const aResult = "a-result";
  it("Should unwrap a promise", async function () {
    const promise = Promise.resolve(aResult);
    expect(
      await Result.fromPromise<string, Error>(promise).getEither()
    ).toEqual(aResult);
  });

  it("Should catch a rejected promise", async function () {
    const promise = Promise.reject(aResult);
    expect(
      await Result.fromPromise<string, Error>(promise).getEither()
    ).toEqual(aResult);
  });

  it("Should catch a rejected promise that is transformed", async function () {
    const promise = Promise.reject(error);
    expect(Fail.of(error).getEither()).toEqual(error);
    expect(
      await Result.fromPromise<string, Error>(promise).getEither()
    ).toEqual(error);
  });

  it("Should map a result", async function () {
    const promise = Promise.reject(aResult);
    expect(
      await Result.fromPromise<string, Error>(promise)
        .map(
          () => "result",
          (original) => {
            expect(original).toEqual(aResult);
            return new Error();
          }
        )
        .getEither()
    ).toBeInstanceOf(Error);
  });
});

describe(AsyncResult.name, function () {
  it("unwraps a promised result", async function () {
    const success = await AsyncResult.unwrapResult(
      Promise.resolve(Result.success(value))
    ).map((i) => i);
    const fail = await AsyncResult.unwrapResult(
      Promise.resolve(Result.fail(error))
    ).mapFailure((e) => e);

    expect(success.getEither()).toEqual(value);
    expect(success.isSuccess()).toBeTruthy();

    expect(fail.isFailure()).toBeTruthy();
    expect(fail.getEither()).toEqual(error);
  });

  it("captures maps thrown values as errors", async function () {
    const result = await AsyncResult.fromPromise(Promise.resolve(error)).map(
      (v) => {
        throw v;
      }
    );
    expect(result.isFailure()).toBeTruthy();
  });

  it("captures maps thrown values as errors", async function () {
    const result = await AsyncResult.fromPromise(Promise.resolve(error)).map(
      (v) => {
        throw v;
      }
    );
    expect(result.isFailure()).toBeTruthy();
  });

  it("is perfectly content to fail with an undefined value", async function () {
    const result = await AsyncResult.fromPromise(Promise.reject(error))
      .map((v) => {
        throw v;
      })
      .map(
        (i) => i,
        () => {
          return undefined!;
        }
      );
    expect(result.isFailure()).toBeTruthy();
    expect(result.getEither()).toEqual(undefined);
  });

  it("maps through promises", async function () {
    const result = await Result.fail(error).mapAsync(
      async (v) => v,
      async (e) => e
    );

    expect(result.getEither()).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
  });

  it("maps through promises", async function () {
    const result = await AsyncResult.fromPromise(
      Promise.reject(error)
    ).mapAsync(
      async (v) => v,
      async (e) => e
    );

    expect(result.getEither()).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
  });
});

describe("Timeouts", () => {
  const timeout = (ms: number): Promise<"Success"> =>
    new Promise((res) => setTimeout(() => res("Success"), ms));

  it("Timesout", async () => {
    const result = await AsyncResult.fromPromise(timeout(1000))
      .withTimeout(100)
      .getEither();

    expect(result).toBeInstanceOf(ResultTimeout);
  });

  it("Does not timeout", async () => {
    const result = await AsyncResult.fromPromise(timeout(10))
      .withTimeout(20)
      .getEither();

    expect(result).toEqual("Success");
  });

  it("Throws a custom error", async () => {
    const err =  new Error('This one')
    const result = await AsyncResult.fromPromise(timeout(100))
      .withTimeout(1, err)
      .getEither();

    expect(result).toEqual(err)
  });
});
