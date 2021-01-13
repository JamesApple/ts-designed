import {EntityConfig} from "./EntityConfig";
import {Enum, FieldConfig, FieldConfigArgs} from "./FieldConfig";
import {Base} from "./Base";

/**
 * Field decorates a property to allow use in other helpers within the
 * entity library.
 */
export function Field<E extends Enum, B extends typeof Base>(
  fieldConfig: Omit<FieldConfigArgs<E, B>, "name"> = {}
): PropertyDecorator {
  return function (proto: Object, property: string | symbol) {
    const entityConfig = EntityConfig.forPrototype(proto);
    const name = property.toString();

    // reflect-metadata may provide an entity by type if enabled.
    let entity: any;
    let reflectedEntity: any;
    if ("getMetadata" in Reflect) {
      entity = (Reflect as any).getMetadata("design:type", proto, property);
      if (entity) {
        reflectedEntity = entity;
      }
      if (!entity || !(entity.prototype instanceof Base)) {
        entity = undefined;
      }
    }

    entityConfig.addField(
      new FieldConfig({
        ...(reflectedEntity && {reflectedEntity}),
        ...(entity && {entity}),
        ...fieldConfig,
        name
      })
    );
  };
}
