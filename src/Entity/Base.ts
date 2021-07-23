/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {WithoutFunctions} from "./utilityTypes";
import {EntityMapping} from "./EntityMapping";
import {ClassFieldReader, EntityFieldReader} from "./FieldReader";
import {AsJsonResult, EntitySerializer} from "./EntitySerializer";
import {Optional} from "../Optional";
import {Attributes} from "./AttributeTypes";


export class Base {
  /**
   * Map then validate an entity
   */
  static create<T extends typeof Base>(
    this: T,
    args?: Attributes<InstanceType<T>>
  ): InstanceType<T> {
    const instance = this.build(args as any);
    instance.validate();
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

  static fields<T extends typeof Base>(this: T): ClassFieldReader<T> {
    return new ClassFieldReader(this);
  }

  fields<T extends Base>(this: T): EntityFieldReader<T> {
    return new EntityFieldReader(this) as any;
  }

  serialize<T extends Base>(this: T): EntitySerializer<T> {
    return new EntitySerializer(this);
  }

  /**
   * This should throw if an entity is invalid
   */
  validate<T extends Base>(this: T): void {}

  static fromJSON<T extends typeof Base>(this: T, data: any): InstanceType<T> {
    return this.create(data);
  }

  toJSON(): AsJsonResult<this> {
    return this.asJSON();
  }

  asJSON(): AsJsonResult<this> {
    return this.serialize().asJSON();
  }

  maybe<T, K extends keyof WithoutFunctions<T>>(
    this: T,
    value: K
  ): Optional<Exclude<T[K], null | undefined>> {
    return Optional.of(this[value]);
  }

  /**
   * @description
   * This is a "noop" method used internally to access the attribute type of an instance outside of its class
   */
  __attributes(): Attributes<this> {
    return this
  }

}

export function isEntityConstructor(o: unknown): o is Base {
  return o === Base || (o as any)?.prototype instanceof Base;
}
