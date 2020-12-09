import {Attributes, Base} from "./Base";
import {EntityConfig} from "./EntityConfig";
import {FieldConfig} from "./FieldConfig";

export class EntityMapping {
  private data: Object;

  constructor(public instance: Base, args: Attributes<Base> = {}) {
    this.data = args;
  }

  map(): void {
    this.entityConfig.eachField((f) => {
      this.assign(f, getValue(f.name, this.data, f));
    });
  }

  private assign(field: FieldConfig, data: Object): void {
    (this.instance as any)[field.name] = data;
  }

  get entityConfig(): EntityConfig {
    return EntityConfig.forInstance(this.instance);
  }
}

export function getValue(path: string, object: unknown, f: FieldConfig): any {
  return f.deserialize((object as any)[path]);
}
