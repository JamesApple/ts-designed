import {Memoize} from "../index";

describe("Memoize", () => {
  class Counter {
    constructor(private count = 0) {}

    @Memoize.All()
    increment(): number {
      this.count = this.count + 1;
      return this.count;
    }

    // bust(): void {
    //   Memoize.All.bust(this, "increment");
    // }
  }

  it("Memoizes the return value", () => {
    const counter = new Counter();

    expect(counter.increment()).toEqual(1);
    expect(counter.increment()).toEqual(1);
    expect(counter.increment()).toEqual(1);

    // counter.bust();
    // expect(counter.increment()).toEqual(2);
    // expect(counter.increment()).toEqual(2);

    const newCounter = new Counter(1);
    expect(newCounter.increment()).toEqual(2);
  });
});
