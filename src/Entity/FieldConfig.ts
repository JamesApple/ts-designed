import {Base} from "./Base";
import {EntityConfig} from "./EntityConfig";

export interface FieldConfigArgs {
  decorators?: PropertyDecorator[];
  entity?: typeof Base;
  iterable?: boolean;
  name: string;
}

export class FieldConfig {
  public name: string;
  public iterable: boolean;
  public entity?: typeof Base;

  private decorators: PropertyDecorator[];
  constructor({
    name,
    decorators = [],
    entity,
    iterable = false
  }: FieldConfigArgs) {
    this.name = name;
    this.decorators = decorators;
    this.entity = entity;
    this.iterable = iterable;
  }

  initialize(parent: EntityConfig): void {
    this.decorators.forEach((d) => d(parent.proto, this.name));
  }
}
