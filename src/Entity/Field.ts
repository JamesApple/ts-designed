import {EntityConfig} from "./EntityConfig";
import {FieldConfig, FieldConfigArgs} from "./FieldConfig";
import {Base} from "./Base";

/**
 * Field decorates a property to allow use in other helpers within the
 * entity library.
 */
export function Field(
  fieldConfig: Omit<FieldConfigArgs, "name" | "reflectedEntity"> = {}
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

    if ("entity" in fieldConfig && fieldConfig.entity === undefined) {
      throw new TypeError(
        `Designed: Entity.Field({ entity }) was set to undefined. This may indicate a circular dependency has been introduced.`
      );
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
