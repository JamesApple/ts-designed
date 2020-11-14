import {EntityConfig} from "./EntityConfig";
import {FieldConfig, FieldConfigArgs} from "./FieldConfig";
import {Base} from "./Base";

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

    // reflect-metadata may provide an entity by type if enabled.
    let entity: any;
    let reflectedEntity: any;
    if ("getMetadata" in Reflect) {
      entity = (Reflect as any).getMetadata("design:type", proto, property);
      if (!entity || !(entity instanceof Base)) {
        entity = undefined;
      } else if (entity) {
        reflectedEntity = entity;
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
