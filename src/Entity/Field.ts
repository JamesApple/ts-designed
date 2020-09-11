import {EntityConfig} from "./EntityConfig";
import {FieldConfig} from "./FieldConfig";

/**
 * Field decorates a property to allow use in other helpers within the
 * entity library.
 */
export function Field(_: Object = {}): PropertyDecorator {
  return function (proto: Object, property: string | symbol) {
    const entityConfig = EntityConfig.forPrototype(proto);
    const propertyAsString = property.toString();

    entityConfig.addField(new FieldConfig(propertyAsString));
  };
}
