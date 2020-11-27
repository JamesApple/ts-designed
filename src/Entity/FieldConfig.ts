import {EntityConfig} from "./EntityConfig";

export interface FieldConfigArgs {
  reflectedEntity?: any;
  entity?: Object;
  deserialize?: (v: any) => any;
  name: string;
}

export class FieldConfig {
  public name: string;

  public reflectedEntity: any;
  public entity?: Object;

  private _deserialize?: (v: any) => any;

  constructor({name, entity, reflectedEntity, deserialize}: FieldConfigArgs) {
    this.name = name;
    this.entity = entity;
    this.reflectedEntity = reflectedEntity;
    this._deserialize = deserialize;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialize(_parent: EntityConfig): void {}

  deserialize(value: Object): any {
    if (this._deserialize) {
      return this._deserialize(value);
    }
    const entity = this.entity ?? this.reflectedEntity;
    if (entity && "fromJSON" in entity && value != null) {
      if (
        typeof value === "object" &&
        "constructor" in value &&
        value.constructor === entity
      ) {
        return value;
      }
      return entity.fromJSON(value);
    }
    return value;
  }

  clone(): FieldConfig {
    const {reflectedEntity, entity, name} = this;
    return new FieldConfig({
      reflectedEntity,
      entity,
      name
    });
  }
}
