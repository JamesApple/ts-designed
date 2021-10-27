/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {DomainError} from "../DomainError";
import {Optional} from "../Optional";
import {MergeUnion, Require} from "./utilityTypes";

type Tuple<K extends string, V> = {[key in K]: V};

type UnionableClass = {
  fromJSON(...args: any): any;
  new (...args: any): {
    __attributes(): any;
    asJSON(): any;
  };
  __attributes(): any;
  create(data: any): any;
  build(data: any): any;
};

type RequireString<T> = T extends string ? T : never;
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];
type UnionMapped<T extends UnionableClass, TK extends StringKeys<T>> = {
  [K in T[TK]]: Extract<T, Tuple<RequireString<TK>, K>>;
};


type EachCase<
  T extends UnionableClass,
  TK extends StringKeys<InstanceType<T>> & StringKeys<T>,
  RT
> = {
  [K in RequireString<keyof UnionMapped<T, TK>>]: (
    value: InstanceType<UnionMapped<T, TK>[K]>
  ) => RT;
};

export class UnionDeserializationError extends DomainError {}


class Union<
  T extends UnionableClass,
  TK extends StringKeys<InstanceType<T>> & StringKeys<T>
> {
  __designed_type: "UNION";

  static define<
    T extends UnionableClass,
    TK extends StringKeys<InstanceType<T>> & StringKeys<T>
  >(config: {entries: T[]; key: TK}) {

    const classes: any = config.entries.reduce((acc, klass) => {
      (acc as any)[klass[config.key]] = klass;
      return acc;
    }, {});

    return class extends Union<T, TK> {
      get key(): TK {
        return config.key;
      }
      static entries = config.entries;

      static readonly typeList: T[TK][] = config.entries.map(
        (value) => value[config.key]
      );

      static readonly classes: UnionMapped<T, TK> = classes;

      static create<T extends {new (...args: any[]): any}>(
        this: T,
        data: ReturnType<InstanceType<T>["__attributes"]> | InstanceType<T>
      ): InstanceType<T> {
        const value = (this as any).fromJSON(data);
        if (!value) {
          throw UnionDeserializationError.create(
            "that could not be deserialized",
            {details: {data, value}}
          );
        }
        if ("validate" in value) {
          value.validate();
        }
        return value;
      }

      static build(data: Parameters<T["build"]>[0]) {
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
        return this.fromJSON(data);
      }

      /**
       * TODO:
       * This method does not warn when a missing tag or unknown tag is provided
       */
      static fromJSON<T extends {new (...args: any): any}>(
        this: T,
        data: any
      ): InstanceType<T> | undefined {
        if (data instanceof this) {
          return data;
        }
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
        return new this(klass.create(data));
      }
    };
  }

  get key(): TK {
    throw new Error('Not implemented')
  }
  constructor(public value: InstanceType<T>) {}

  is<K extends keyof UnionMapped<T, TK>>(
    type: K
  ): Optional<InstanceType<UnionMapped<T, TK>[K]>> {
    return Optional.of(this.value).filter(
      (value) => (value as any)[this.key] === type
    );
  }

  allCases<RT>(cased: EachCase<T, TK, RT>): RT {
    const key = this.value[this.key];
    const caseFn = (cased as any)[key];
    return caseFn(this.value);
  }

  get merged(): MergeUnion<InstanceType<T>> {
    return this.value as any;
  }

  asJSON(): ReturnType<InstanceType<T>["asJSON"]> {
    return this.value.asJSON();
  }

  toJSON() {
    return this.value.asJSON();
  }

  __class(): T {
    throw new Error('Not implemented')
  }

  __attributes():
    | ReturnType<InstanceType<T>["__attributes"]>
    | InstanceType<T> {
    return this.value;
  }
}

namespace Union {
  export type Classes<T> = Require<T> extends Union<infer C, any> ? C : never

  export type Instances<T> = Require<T> extends Union<infer C, any> ? InstanceType<C> : never

  export type Data<T> = Require<T> extends Union<infer C, any> ? ReturnType<InstanceType<C>['__attributes']> : never

  export type AsJSONResult<T> = Require<T> extends Union<infer C, any> ? ReturnType<InstanceType<C>['asJSON']> : never

  /**
   * The instances of the union, the arguments to create a union, or the union instance itself
   */
  export type Attributes<T> = Require<T> extends Union<any, any> ? Data<T> | Instances<T> | T : never

  export type IsUnion<T> = Require<T> extends Union<any, any> ? true : false

  export type Keys<T> = Require<T> extends Union<infer C, infer K> ? C[K] : never
}


export { Union }
