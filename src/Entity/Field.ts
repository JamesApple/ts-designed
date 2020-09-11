import {EntityConfig} from "./EntityConfig";
import {FieldConfig, FieldConfigArgs} from "./FieldConfig";

/**
 * Field decorates a property to allow use in other helpers within the
 * entity library.
 */
export function Field(
  fieldConfig: Omit<FieldConfigArgs, "name"> = {}
): PropertyDecorator {
  return function (proto: Object, property: string | symbol) {
    const entityConfig = EntityConfig.forPrototype(proto);
    const name = property.toString();

    entityConfig.addField(new FieldConfig({...fieldConfig, name}));
  };
}
