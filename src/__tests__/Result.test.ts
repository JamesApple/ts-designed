import {Result} from "../Result";

describe("Result", () => {
  const aResult = "a-result";
  it("Should unwrap a promise", async function () {
    const promise = Promise.resolve(aResult);
    const result = await Result.fromPromise<string, Error>(promise);
    expect(result.getEither()).toEqual(aResult);
  });

  it("Should catch a rejected promise", async function () {
    const promise = Promise.reject(aResult);
    const result = await Result.fromPromise<string, Error>(promise);
    expect(result.getEither()).toEqual(aResult);
  });
});
