import {Fail, Result} from "../Result";

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
    const promise = Promise.reject("value");
    expect(Fail.of("value").getEither()).toEqual("value");
    expect(
      await Result.fromPromise<string, Error>(promise).getEither()
    ).toEqual("value");
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
