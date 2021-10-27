import type { Attributes, Base } from ".";

import {EntityConfig} from "./EntityConfig";

export interface FieldData<
  T extends HasFieldsIntrospection,
  K extends keyof Attributes<T>
> {
  name: K;
  entityConstructor?: Object;
  fieldArrayLike: boolean;
  nullable: boolean
}

export interface FieldDataWithSubfields<
  T extends HasFieldsIntrospection,
  K extends keyof Attributes<T>
> extends FieldData<T, K> {
  subFields?: MappedFieldUnion<T[K]>;
}

export class ClassFieldReader<
  T extends typeof Base,
  I extends Required<InstanceType<T>> = Required<InstanceType<T>>
> {
  constructor(private konstructor: T) {}

  all(): MappedFieldUnion<I> {
    const fields = this.config.getFields();
    return fields.map((f) => {
      return {
        name: f.name,
        fieldArrayLike: f.isArrayLike(),
        entityConstructor: f.entity ?? f.reflectedEntity,
        nullable: f.nullable,
        subFields: isHasFieldsIntrospection(f.entity)
          ? f.entity?.fields()?.all()
          : undefined
      } as any;
    });
  }

  private get config(): EntityConfig {
    return EntityConfig.forConstructor(this.konstructor);
  }
}

export class EntityFieldReader<
  I extends HasFieldsIntrospection,
  T extends HasFieldsIntrospection = Required<I>
> {
  /*
   * Instance must be set to required or field types will break when accessing optional values
   */
  instance: T;
  constructor(instance: T) {
    this.instance = instance as T;
  }

  /**
   * This will only return fields with `null` if the entity has configured it as such
   */
  onlySet(): MappedFieldUnion<T> {
    return this.parentFields.filter((field) => {
      const fieldValue = this.instance[field.name];
      if(field.nullable === true && fieldValue === null) {
        return true
      }
      return fieldValue != null;
    });
  }

  onlyUnset(): MappedFieldUnion<T> {
    return this.parentFields.filter((field) => {
      const fieldValue = this.instance[field.name];
      return fieldValue == null;
    });
  }

  all(): MappedFieldUnion<T> {
    return this.parentFields;
  }

  private get parentFields(): MappedFieldUnion<T> {
    return new ClassFieldReader(this.instance.constructor as any).all() as any;
  }
}

interface HasFieldsIntrospection {
  fields(): {
    all(): any;
  };
}

function isHasFieldsIntrospection(
  maybeEntity: unknown
): maybeEntity is HasFieldsIntrospection {
  return typeof (maybeEntity as any)?.fields === "function";
}

type ValueOf<T> = T[keyof T];
type MappedFieldUnion<T> = ValueOf<
  {
    [K in keyof Attributes<T>]: T extends HasFieldsIntrospection ? T[K] extends HasFieldsIntrospection
      ? FieldDataWithSubfields<T, K>
      : FieldData<T, K> : never;
  }
>[];
