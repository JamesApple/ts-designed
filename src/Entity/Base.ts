import {CreateArgs} from "./utilityTypes";
import {EntityMapping} from "./EntityMapping";
import {ClassFieldReader, EntityFieldReader} from "./FieldReader";

export class Base {
  /**
   * Map then validate an entity
   */
  static create<T extends typeof Base, D extends Object>(
    this: T,
    args?: CreateArgs<InstanceType<T>, D>
  ): InstanceType<T> {
    const instance = this.build(args);
    this.validator(instance);
    return instance;
  }

  /*
   * Map an entity
   */
  static build<T extends typeof Base, D extends Object>(
    this: T,
    args?: CreateArgs<InstanceType<T>, D>
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
}

export function isEntityConstructor(o: unknown): o is Base {
  return o === Base || (o as any)?.prototype instanceof Base;
}
