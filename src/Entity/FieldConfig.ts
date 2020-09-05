import {
  EntityConstructor,
  EntityInitializationError,
  FieldConfiguration,
  IterableConstructor
} from "./utilityTypes";

export const createFieldConfig = (
  property: string,
  data: FieldConfiguration<EntityConstructor>
) => {
  switch (data.type) {
    case "primitive":
      return new PrimitiveFieldConfig(property);
    case "nested_model":
      return new NestedModelFieldConfig(data.class, property);
    case "iterable_nested_model":
      return new IterableNestedModelFieldConfig(
        data.class,
        data.iterableClass,
        property
      );
    default:
      const {type} = data ?? ({} as any);
      throw new EntityInitializationError(
        `type ${type} is not a valid field configuration for field ${property}`
      );
  }
};

export class FieldConfig {
  constructor(public name: string) {}
}

export class PrimitiveFieldConfig extends FieldConfig {
  constructor(...rest: ConstructorParameters<typeof FieldConfig>) {
    super(...rest);
  }
}

export class NestedModelFieldConfig extends FieldConfig {
  constructor(
    private konstructor: EntityConstructor,
    ...rest: ConstructorParameters<typeof FieldConfig>
  ) {
    super(...rest);
  }
}

export class IterableNestedModelFieldConfig extends FieldConfig {
  constructor(
    private konstructor: EntityConstructor,
    private iterableConstructor: IterableConstructor<EntityConstructor>,
    ...rest: ConstructorParameters<typeof FieldConfig>
  ) {
    super(...rest);
  }
}
