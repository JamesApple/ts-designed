import {Base} from "./Base";
import {EntityConfig} from "./EntityConfig";

export interface FieldData {
  name: string;
  subFields?: FieldData[];
  entityConstructor?: typeof Base;
}

export class ClassFieldReader {
  constructor(private konstructor: typeof Base) {}

  all(): FieldData[] {
    return this.config.getFields().map(({name, entity}) => {
      return {
        name,
        ...{entityConstructor: entity},
        ...{subFields: entity ? entity.fields().all() : undefined}
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
