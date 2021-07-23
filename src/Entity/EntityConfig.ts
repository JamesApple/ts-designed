import {Base} from "./Base";
import {FieldConfig} from "./FieldConfig";

/**
 * @private
 * This class is internal and likely prone to sudden change
 */
export class EntityConfig {
  constructor(public proto: Object) {}

  wasReflectLoaded = "getMetadata" in Reflect;

  private fields: Map<string | Symbol, FieldConfig> = new Map();

  getFields(): FieldConfig[] {
    return Array.from(this.fields.values());
  }

  eachField(visit: (f: FieldConfig) => void): void {
    for (const f of this.fields.values()) {
      visit(f);
    }
  }

  addField(field: FieldConfig): void {
    field.initialize(this);
    this.fields.set(field.name, field);
  }

  clone(proto: Object): EntityConfig {
    const newConfig = new EntityConfig(proto);
    this.fields.forEach((f) => newConfig.addField(f.clone()));
    newConfig.fields.forEach((f) => f.initialize(newConfig));
    return newConfig;
  }

  static forInstance(entity: Base): EntityConfig {
    return this.forPrototype(Object.getPrototypeOf(entity));
  }

  static forConstructor(constructor: Function): EntityConfig {
    return this.forPrototype(constructor.prototype);
  }

  static forPrototype(proto: Object): EntityConfig {
    const p = proto as Proto;
    let config = p[ENTITY_CONFIGURATION_KEY] ?? new EntityConfig(p);

    // Parent classes will respond with their own entity pre-existing config.
    if (config.proto !== p) {
      config = config.clone(p);
    }

    p[ENTITY_CONFIGURATION_KEY] = config;
    return config;
  }
}

export const ENTITY_CONFIGURATION_KEY = Symbol("ENTITY_CONFIGURATION");

interface Proto {
  [ENTITY_CONFIGURATION_KEY]?: EntityConfig;
}
