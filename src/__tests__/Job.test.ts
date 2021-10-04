import {Jobs} from "..";

const sleep = <T>(n: number, v: T): Promise<T> =>
  new Promise((r) => setTimeout(() => r(v), n));

it(`A) Allows you to control worker concurrency
    B) Demonstrates that a worker pool run at 1 concurrency will finish in a
       different order than one run at greater concurrency due to limiting
`, async function () {
  const firstPool = new Jobs.Workers([10, 5], async (v) => sleep(v, v));
  const secondPool = new Jobs.Workers([10, 5], async (v) => sleep(v, v));

  const [{values: first}, {values: second}] = await Promise.all([
    firstPool.perform({workers: 1}),
    secondPool.perform({workers: 10})
  ]);

  expect(first).toEqual([10, 5]);
  expect(second).toEqual([5, 10]);
});

it("Does not fail given an empty job pool", async function () {
  const pool = new Jobs.Workers([], async (v) => sleep(v, v));
  const {unprocessed, complete, values} = await pool.perform({workers: 1});
  [unprocessed, complete, values].forEach((arr) => expect(arr).toHaveLength(0));
});

it("Times out individual jobs", async function () {
  const firstPool = new Jobs.Workers([10, 5], async (v) => sleep(v, v));
  const {values, errors} = await firstPool.perform({
    jobTimeoutMS: 8,
    workers: 1
  });
  expect(values).toEqual([5]);
  expect(errors).toHaveLength(1);
});

it("Times out the overall queue but completes in progress jobs", async function () {
  const firstPool = new Jobs.Workers([5, 10, 15, 20], async (v) => sleep(v, v));
  const {values, errors, unprocessed} = await firstPool.perform({
    workers: 1,
    acceptJobsUntilMS: 2
  });
  expect(values).toEqual([5]);
  expect(errors).toHaveLength(0);
  expect(unprocessed).toEqual([10, 15, 20]);
});

it("Will complete the entire list of jobs even if it exceeds the overall timeout given the concurrency is greater than the amount of ", async function () {
  const firstPool = new Jobs.Workers([5, 10, 15, 20], async (v) => sleep(v, v));
  const {values, errors, unprocessed} = await firstPool.perform({
    workers: 10,
    acceptJobsUntilMS: 2
  });
  expect(values).toEqual([5, 10, 15, 20]);
  expect(errors).toHaveLength(0);
  expect(unprocessed).toEqual([]);
});
