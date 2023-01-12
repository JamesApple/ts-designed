import {Require, ValueObjectInstance, WithoutFunctions} from "./utilityTypes";
import {EntitySerializer, RemoveNever} from "./EntitySerializer";

// prettier-ignore
export type Attributes<T> = 
Require<T> extends { __designed_type: 'UNION'; __attributes(): any }  ? // Is Direct Union
  ReturnType<Require<T>['__attributes']> | T
: {
  [P in keyof WithoutFunctions<T>]:
      Require<T[P]> extends { __designed_type: 'UNION'; __attributes(): any } ? // Is Union
      ReturnType<Require<T[P]>['__attributes']> | T[P]
    : Require<T[P]> extends (infer AV)[] ? // Is Array
        AttributesOrPrimitive<AV>[]
    : Require<T[P]> extends { serialize(): EntitySerializer<any>; } ? // Is entity
        Attributes<Require<T[P]>> | T[P]
    : Require<T[P]> extends ValueObjectInstance ? // Is value object
        ReturnType<Require<T[P]>["asJSON"]> | T[P]
    : T[P]; // Allow nulls in final type
};

type AttributesOrPrimitive<T> = Exclude<T, null | undefined> extends
  | string
  | number
  | boolean
  ? T
  : Attributes<T>;

export type AttributesOrEntities<T> = {
  [K in keyof WithoutFunctions<T>]: T[K] extends ValueObjectInstance
    ? T[K] | Attributes<T[K]>
    : T[K];
};

export type AttributeSelection<I, K extends keyof Attributes<I>> =
  K extends keyof I ? Pick<I, K> : never;

export type AttributesWithout<I, K extends keyof Attributes<I>> = RemoveNever<
  {
    [OK in keyof Attributes<I>]: OK extends K ? never : Attributes<I>[OK];
  }
>;

export type WithRequiredAttributes<I, K extends keyof Attributes<I>> = {
  [OK in keyof I]: OK extends K ? Exclude<I[OK], null | undefined> : I[OK];
};

export type WithoutAttributes<I, K extends keyof Attributes<I>> = RemoveNever<
  {
    [OK in keyof I]: OK extends K ? never : I[OK];
  }
>;

export type WithOptionalAttributes<I, K extends keyof Attributes<I>> = {
  [OK in keyof I]: OK extends K ? I[OK] | undefined : I[OK];
};

export type WithNullableAttributes<I, K extends keyof Attributes<I>> = {
  [OK in keyof I]: OK extends K ? I[OK] | null : I[OK];
};
