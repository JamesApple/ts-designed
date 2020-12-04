import {Base} from "./Base";
import {EntityConfig} from "./EntityConfig";

export interface FieldData {
  name: string;
  subFields?: FieldData[];
  entityConstructor?: Object;
  fieldArrayLike: boolean;
}

export class ClassFieldReader {
  constructor(private konstructor: typeof Base) {}

  all(): FieldData[] {
    return this.config.getFields().map((f) => {
      return {
        name: f.name,
        fieldArrayLike: f.isArrayLike(),
        ...{entityConstructor: f.entity},
        ...{
          subFields: f.entity ? (f.entity as any)?.fields()?.all() : undefined
        }
      };
    });
  }

  private get config(): EntityConfig {
    return EntityConfig.forConstructor(this.konstructor);
  }
}

export class EntityFieldReader {
  constructor(private instance: Base) {}

  onlySet(): FieldData[] {
    return this.parentFields.filter((field) => {
      const fieldValue = (this.instance as any)[field.name];
      return fieldValue != null;
    });
  }

  onlyUnset(): FieldData[] {
    return this.parentFields.filter((field) => {
      const fieldValue = (this.instance as any)[field.name];
      return fieldValue == null;
    });
  }

  private get parentFields(): FieldData[] {
    return new ClassFieldReader(this.instance.constructor as any).all();
  }
}
