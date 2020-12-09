import {WithoutFunctions} from "./utilityTypes";
import {EntityMapping} from "./EntityMapping";
import {ClassFieldReader, EntityFieldReader} from "./FieldReader";
import {EntitySerializer, RemoveNever} from "./EntitySerializer";
import {Optional} from "..";

export type Attributes<I> = WithoutFunctions<I>;

export type AttributeSelection<I, K extends keyof Attributes<I>> = Pick<I, K>;

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

export class Base {
  /**
   * Map then validate an entity
   */
  static create<T extends typeof Base>(
    this: T,
    args?: Attributes<InstanceType<T>>
  ): InstanceType<T> {
    const instance = this.build(args);
    this.validator(instance);
    return instance;
  }

  /*
   * Map an entity
   */
  static build<T extends typeof Base>(
    this: T,
    args?: Partial<Attributes<InstanceType<T>>>
  ): InstanceType<T> {
    const instance = new this() as InstanceType<T>;
    new EntityMapping(instance, args).map();
    return instance;
  }

  static validator = <T extends Base>(entity: T): T => entity;
  static setValidator<T extends typeof Base>(
    this: T,
    validator: typeof this.validator
  ): void {
    this.validator = validator;
  }

  static fields<T extends typeof Base>(this: T): ClassFieldReader {
    return new ClassFieldReader(this);
  }

  fields<T extends Base>(this: T): EntityFieldReader {
    return new EntityFieldReader(this);
  }

  serialize<T extends Base>(this: T): EntitySerializer<T> {
    return new EntitySerializer(this);
  }

  validate<T extends Base>(this: T): T {
    return (this.constructor as any).validator(this);
  }

  static fromJSON<T extends typeof Base>(
    this: T,
    data: Record<string, unknown>
  ): InstanceType<T> {
    return this.create(data as any);
  }

  toJSON(): Record<string, unknown> {
    return this.asJSON();
  }

  asJSON(): Record<string, unknown> {
    return this.serialize().asJSON();
  }

  maybe<T, K extends keyof WithoutFunctions<T>>(
    this: T,
    value: K
  ): Optional<Exclude<T[K], null | undefined>> {
    return Optional.of(this[value]);
  }
}

export function isEntityConstructor(o: unknown): o is Base {
  return o === Base || (o as any)?.prototype instanceof Base;
}
