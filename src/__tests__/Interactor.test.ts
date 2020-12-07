/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Interactor} from "../";

describe("Interactor", () => {
  class SignUp {
    constructor(public cleanedUp: boolean) {}

    value: string;

    @Interactor.Method() async run(value: string) {
      this.value = value;
      return this;
    }

    @Interactor.Finally()
    cleanme(): any {
      this.cleanedUp = true;
    }
  }

  it("executes methods in clean instances", async function () {
    const baseInstance = new SignUp(false);
    expect(baseInstance.cleanedUp).toEqual(false);

    const instantiated = await baseInstance.run("myValue");
    expect(instantiated.value).toEqual("myValue");
    expect(instantiated.cleanedUp).toBeTruthy();

    expect(baseInstance.cleanedUp).toBeFalsy();
  });
});
