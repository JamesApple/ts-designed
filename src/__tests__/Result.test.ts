import {Result} from "../Result";

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
