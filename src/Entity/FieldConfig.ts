import {EntityConfig} from "./EntityConfig";

export interface FieldConfigArgs {
  decorators?: PropertyDecorator[];
  name: string;
}

export class FieldConfig {
  public name: string;
  private decorators: PropertyDecorator[];

  constructor({name, decorators}: FieldConfigArgs) {
    this.name = name;
    this.decorators = decorators ?? [];
  }

  initialize(parent: EntityConfig): void {
    this.decorators.forEach((d) => d(parent.proto, this.name));
  }
}
