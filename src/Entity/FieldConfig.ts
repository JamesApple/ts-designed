import {EntityConfig} from "./EntityConfig";

export interface FieldConfigArgs {
  reflectedEntity?: any;
  entity?: Object;
  deserialize?: (v: any) => any;
  name: string;
  iterable?: boolean;
}

export class FieldConfig {
  public name: string;

  public reflectedEntity: any;
  public entity?: Object;

  private _deserialize?: (v: any) => any;

  private iterable?: boolean;

  constructor({
    name,
    entity,
    iterable,
    reflectedEntity,
    deserialize
  }: FieldConfigArgs) {
    this.name = name;
    this.entity = entity;
    this.reflectedEntity = reflectedEntity;
    this._deserialize = deserialize;
    this.iterable = iterable;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialize(_parent: EntityConfig): void {}

  deserialize(value: Object): any {
    const entity = this.entity ?? this.reflectedEntity;
    const mapSingle = (v: Object): any => {
      if (this._deserialize) {
        return this._deserialize(v);
      }
      if (entity && "fromJSON" in entity && v != null) {
        if (
          typeof v === "object" &&
          "constructor" in v &&
          v.constructor === entity
        ) {
          return v;
        }
        return entity.fromJSON(v);
      }
      return v;
    };
    if (value && this.isArrayLike()) {
      return (value as Array<any>).map(mapSingle);
    } else {
      return mapSingle(value);
    }
  }

  isArrayLike(): boolean {
    if (this.iterable != null) {
      return this.iterable;
    }
    if (this.reflectedEntity) {
      return (
        this.reflectedEntity === Array ||
        this.reflectedEntity.prototype instanceof Array
      );
    }
    return false;
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
