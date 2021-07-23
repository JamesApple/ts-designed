/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {DomainError} from "../DomainError";
import {Optional} from "../Optional";

type Tuple<K extends string, V> = {[key in K]: V};

type ValueObjectClass = {fromJSON(...args: any): any; new (...args: any): any};
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];
type String<T> = T extends string ? T : never;
type UnionMapped<T extends ValueObjectClass, TK extends StringKeys<T>> = {
  [K in T[TK]]: Extract<T, Tuple<String<TK>, K>>;
};

export class UnionDeserializationError extends DomainError {}

export abstract class Union<
  T extends ValueObjectClass,
  TK extends StringKeys<InstanceType<T>> & StringKeys<T>
> {
  __designed_type: "UNION";

  static define<
    T extends ValueObjectClass,
    TK extends StringKeys<InstanceType<T>> & StringKeys<T>
  >(config: {entries: T[]; key: TK}) {
    return class extends Union<T, TK> {
      key = config.key;
      entries = config.entries;

      static create(data: ReturnType<InstanceType<T>["asJSON"]>) {
        const value = this.fromJSON(data);
        if (!value) {
          throw UnionDeserializationError.create(
            "that could not be deserialized",
            {details: {value}}
          );
        }
        if ("validate" in value) {
          (value as any).validate();
        }
        return value;
      }

      static build(data: Partial<ReturnType<InstanceType<T>["asJSON"]>>) {
        return this.fromJSON(data);
      }

      /**
       * @todo
       * This method does not warn when a missing tag or unknown tag is provided
       */
      static fromJSON<T extends {new (...args: any): any}>(
        this: T,
        data: any
      ): InstanceType<T> | undefined {
        if (typeof data !== "object") {
          return undefined!;
        }
        const tag = data[config.key];
        if (!tag) {
          return undefined!;
        }
        const klass = config.entries.find((entry) => entry[config.key] === tag);
        if (!klass) {
          return undefined!;
        }
        return new this(klass.fromJSON(data));
      }
    };
  }

  protected key: TK;
  protected entries: T[];
  constructor(public value: InstanceType<T>) {}

  is<K extends keyof UnionMapped<T, TK>>(
    type: K
  ): Optional<InstanceType<UnionMapped<T, TK>[K]>> {
    return Optional.of(this.value).filter((value) => value[this.key] === type);
  }

  asJSON(): ReturnType<InstanceType<T>["asJSON"]> {
    return this.value.asJSON();
  }
}
