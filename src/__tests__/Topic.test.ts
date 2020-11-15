import {Topic} from "..";
describe("Topic", function () {
  let topic: Topic<any>;
  beforeEach(() => {
    topic = Topic.create();
  });

  it("should allow subscription and teardown", async function () {
    topic.subscribe(() => {})();
  });

  it("should report notifications to multiple subscribers", async function () {
    let value = 0;
    const teardown = topic.subscribe((n) => (value += n));

    topic.publish(1);
    expect(value).toEqual(1);

    topic.publish(1);
    expect(value).toEqual(2);

    teardown();

    topic.publish(1);
    expect(value).toEqual(2);
  });
});
