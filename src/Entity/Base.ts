import {WithoutFunctions} from "./utilityTypes";
import {EntityMapping} from "./EntityMapping";
import {ClassFieldReader, EntityFieldReader} from "./FieldReader";
import {EntitySerializer} from "./EntitySerializer";
import {Optional} from "..";

/**
 * Type of non function attributes. This currently ignores any methods that may
 * have been defined on the entity.
 */
export type Attributes<I extends Base> = WithoutFunctions<I>;

export type AttributeSelection<
  I extends Base,
  K extends keyof Attributes<I>
> = Pick<I, K>;

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
