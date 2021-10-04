/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {All} from "../Memoize/All";
import {AsyncResult, Result} from "../Result";

interface Config {
  /**
   * Defaults to 10
   */
  workers?: number;
  /**
   * Defaults to unlimited
   *
   * Duration in milliseconds an inidividual job is allowed to take before it
   * is removed from the worker queue.
   *
   * This does not use an abort controller so
   * actions may occur after the result completes.
   */
  jobTimeoutMS?: number;

  /**
   * Defaults to unlimited
   *
   * Will stop accepting new jobs once this timeout has elapsed
   */
  acceptJobsUntilMS?: number;
}

export class Workers<DT, RT> {
  static perform<DT, RT>(data: DT[], action: (a0: DT) => Promise<RT>, config?: Config) {
    return new Workers(data, action).perform(config ?? {})
  }

  constructor(private data: DT[], private act: (a0: DT) => Promise<RT>) {}

  get jobCount() {
    return this.data.length
  }

  private results: Result<RT>[] = [];

  private workers: Worker[];

  async perform(args: Config): Promise<WorkersResult<DT, RT>> {
    let acceptMoreJobs = true;
    let timeout: NodeJS.Timeout | undefined;
    if (args.acceptJobsUntilMS) {
      setTimeout(() => (acceptMoreJobs = false), args.acceptJobsUntilMS);
    }
    try {
      if (this.jobCount === 0) {
        return new WorkersResult(this);
      }
      args.workers ||= 10;
      this.workers = Array.from(
        {length: Math.min(args.workers, this.jobCount)},
        () => new Worker(this)
      );

      let job: (() => Promise<RT>) | null;
      while ((job = this.nextJob())) {
        const worker = await this.getWorker();
        if(acceptMoreJobs) {
          worker.accept(job, args.jobTimeoutMS);
        } else {
          this.returnJob()
          break;
        }
      }

      await this.drainWorkers();
      return new WorkersResult(this);
    } finally {
      if(timeout) {
        clearTimeout(timeout);
      }
    }
  }

  private jobIndex = 0;
  private returnJob() {
    this.jobIndex--
  }
  private nextJob(): (() => Promise<RT>) | null {
    if (this.jobIndex < this.jobCount) {
      const index = this.jobIndex;
      const job = () => this.act(this.data[index]);
      this.jobIndex++;
      return job;
    }
    return null;
  }

  private async drainWorkers() {
    return Promise.all(this.workers.map((w) => w.waitForFree()));
  }

  private async getWorker() {
    return Promise.race(this.workers.map((w) => w.waitForFree()));
  }
}

export class WorkersResult<DT, RT> {
  @All() get unprocessed() {
    return this.workers["data"].slice(this.workers["jobIndex"]);
  }

  @All() get values() {
    const values: RT[] = [];
    this.complete.forEach((r) => r.tap((v) => values.push(v)));
    return values;
  }

  @All() get errors() {
    const errors: Error[] = [];
    this.complete.forEach((r) =>
      r.tap(
        (i) => i,
        (err) => errors.push(err)
      )
    );
    return errors;
  }

  get complete() {
    return this.workers["results"];
  }

  constructor(private workers: Workers<DT, RT>) {}
}

class Worker {
  constructor(private workers: Workers<any, any>) {}

  private current?: AsyncResult<any>;

  accept(job: () => Promise<any>, timeout?: number) {
    let result = Result.fromPromise(job());
    if (timeout) {
      result = result.withTimeout(timeout);
    }
    result.then((r) => this.workers["results"].push(r));
    this.current = result;
  }

  async waitForFree(): Promise<Worker> {
    if (!this.current) {
      return this;
    }
    return this.current.then(() => this);
  }
}
