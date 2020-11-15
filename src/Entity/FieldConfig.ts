import {Base} from "./Base";
import {EntityConfig} from "./EntityConfig";

export interface FieldConfigArgs {
  decorators?: PropertyDecorator[];
  reflectedEntity?: any;
  entity?: typeof Base;
  iterable?: boolean;
  name: string;
}

export class FieldConfig {
  public name: string;
  public iterable: boolean;
  public entity?: typeof Base;
  private reflectedEntity: any;

  private decorators: PropertyDecorator[];
  constructor({
    name,
    decorators = [],
    entity,
    reflectedEntity,
    iterable = false
  }: FieldConfigArgs) {
    this.name = name;
    this.decorators = decorators;
    this.entity = entity;
    this.reflectedEntity = reflectedEntity;
    this.iterable = iterable;
  }

  initialize(parent: EntityConfig): void {
    this.decorators.forEach((d) => d(parent.proto, this.name));
  }

  deserialize(value: Object) {
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
}
