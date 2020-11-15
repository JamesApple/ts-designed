type TeardownFunction = () => void;
type ConsumerFunction<T> = (event: T) => void;

export interface Topic<T> {
  subscribe(consumer: ConsumerFunction<T>): TeardownFunction;
  publish(event: T): void;
}

export interface TopicConfig<T> {
  onSubscriberErr?: (err: Error, event: T) => void;
}

type FinalTopicConfig<T> = Required<TopicConfig<T>>;

const defaults = {
  onSubscriberErr: () => {}
};
const guaranteeConfig = <T>(config?: TopicConfig<T>): FinalTopicConfig<T> =>
  Object.assign({}, config, defaults);

export class Topic<T> implements Topic<T> {
  static create<T>(config?: TopicConfig<T>): Topic<T> {
    return new Topic<T>(guaranteeConfig(config));
  }
  protected constructor(private config: FinalTopicConfig<T>) {}
  private subscribers: Set<ConsumerFunction<T>> = new Set();

  subscribe(consumer: ConsumerFunction<T>): TeardownFunction {
    this.subscribers.add(consumer);
    return () => this.subscribers.delete(consumer);
  }

  publish(event: T): void {
    this.subscribers.forEach((subscriber) => {
      try {
        subscriber(event);
      } catch (e) {
        this.config.onSubscriberErr(e, event);
      }
    });
  }
}
