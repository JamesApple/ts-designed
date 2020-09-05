import {EntityConfig} from "./EntityConfig";
import {createFieldConfig} from "./FieldConfig";
import {EntityConstructor, FieldConfiguration} from "./utilityTypes";

/**
 * Field decorates a property to allow use in other helpers within the
 * entity library.
 */
export function Field<T extends EntityConstructor>(
  config: FieldConfiguration<T> = {type: "primitive"}
): PropertyDecorator {
  return function (proto: Object, property: string | symbol) {
    const entityConfig = EntityConfig.forPrototype(proto);
    const propertyAsString = property.toString();

    entityConfig.addField(createFieldConfig(propertyAsString, config));
  };
}
