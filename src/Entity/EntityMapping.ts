import {Attributes, Base} from "./Base";
import {EntityConfig} from "./EntityConfig";
import {FieldConfig} from "./FieldConfig";

export class EntityMapping {
  private dataBlob: any;

  constructor(public instance: Base, args: Attributes<Base> = {}) {
    this.dataBlob = args;
  }

  map(): void {
    this.entityConfig.eachField((fieldConfig) => {
      const value = this.extractValueFromBlob(fieldConfig)

      if(value === null && !fieldConfig.nullable) {
        return
      }

      this.assign(fieldConfig, value);
    });
  }

  private extractValueFromBlob(fieldConfig: FieldConfig): any {
    return fieldConfig.deserialize(this.dataBlob[fieldConfig.name]);
  }

  private assign(field: FieldConfig, data: Object): void {
    (this.instance as any)[field.name] = data;
  }

  get entityConfig(): EntityConfig {
    return EntityConfig.forInstance(this.instance);
  }
}
